const warpjsUtils = require('@warp-works/warpjs-utils');

const WarpRelationshipPanelItem = require('./relationship-panel-item');
const WarpTable = require('./table');

class RpiTable extends WarpRelationshipPanelItem {
    constructor(parent, config) {
        super(parent, config);
        this.config = config;
    }

    init() {
    // Table needs a TableView
        var relnID = this.config.relationship[0];
        var reln = this.getWarpJSClient().model.getRelationshipByID(relnID);
        this.targetEntity = this.getWarpJSClient().model.getEntityByID(reln.targetEntity[0]);

        var tv = null;
        if (this.config.view) {
            tv = this.config.view;
        } else { // Get default view
            tv = this.getWarpJSClient().model.getDefaultTableView(this.targetEntity);
        }

        this.tableID = this.globalID() + "_table";
        var tableConfig = {
            relationshipProxy: this.getRelationshipProxy(),
            globalID: this.tableID,
            callbackRowSelected: RpiTable.prototype.rowSelected,
            callbackAdd: RpiTable.prototype.add.bind(this),
            callbackContext: this,
            tableViewJson: tv
        };
        this.warpTable = new WarpTable(tableConfig);
    }

    createViews(parentHtml, callback) {
        var elem = $("<div></div>");
        this.warpTable.createViews(elem, function() {
        // Rember the HTML table:
            this.table = $("#" + this.tableID);

            // Alert to be shown in case parent is new:
            this.alertNew = $('<div class="alert alert-warning">Save new element first before adding to \'' + this.label + '\'!</div>');
            this.alertNew.prop('id', this.globalID() + '_alertNew');
            elem.append(this.alertNew);

            parentHtml.append(elem);
            callback();
        }.bind(this));
    }

    updateViewWithDataFromModel(callback) {
        var ep = this.getPageView().getEntityProxy();
        if (ep.mode === "addNewEntity") {
        // var t = $("#" + this.globalID());
            this.table.hide();
            this.alertNew.show();
            callback();
        } else {
            this.table.show();
            this.alertNew.hide();
            this.warpTable.updateViewWithDataFromModel(callback);
        }
    }

    updateModelWithDataFromView(callback) {
        callback();
    }

    add() {
        warpjsUtils.trace(1, "RpiTable.add():\n-  Add-Click for " + this.globalID());
        if (this.relnDetails.targetJson.entityType === "Document") {
            var pv = this.getPageView();
            var ep = pv.getEntityProxy();
            ep.addNewDocument(this.relationshipID);
        } else {
            throw new Error("Sorry - adding embedded document to table is currently not supported (since tables can't be edited)!");
        }
    }

    rowSelected() {
        warpjsUtils.trace(1, "RpiTable.rowSelected():\n-  Click for " + this.type + ', id:' + this.id);
        $warp.openInNewPage(this.id, this.type);
    }
}

module.exports = RpiTable;
