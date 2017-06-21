const utils = require('./../utils');

class WarpTable {
    constructor(tableConfig) {
        this.relationshipProxy = tableConfig.relationshipProxy;
        this.callbackRowSelected = tableConfig.callbackRowSelected;
        this.callbackAdd = tableConfig.callbackAdd;
        this.callbackContext = tableConfig.callbackContext;
        this.tableViewJson = tableConfig.tableViewJson;
        this._globalID = tableConfig.globalID;
    }

    globalID() {
        return this._globalID;
    }

    createViews(parentHtml, callback) {
        var mainElem = $('<div></div>');
        mainElem.prop('id', this.globalID());

        // Table
        var table = $('<table class="table table-sm table-hover"></table>');
        table.prop('id', this.globalID() + "_table");

        // Pagination
        var formInline = $('<form    class="form-inline"></form>');
        var formGroup = $('<div     class="form-group"></div>');
        var inputGrp = $('<div     class="input-group"></div>');
        var inputGrpAddonLft = $('<div     class="input-group-addon"></div>');
        var inputGrpAddonIdx = $('<div     class="input-group-addon">IDX</div>');
        var hrefLft = $('<a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a>');
        var inputGrpAddonRgt = $('<div     class="input-group-addon"></div>');
        var hrefRgt = $('<a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a>');

        var inputGrpAddonAdd = $('<div     class="input-group-addon"></div>');
        var hrefAdd = $('<a href="#"><span class="glyphicon glyphicon-plus-sign"></span></a>');

        // Bind event handlers
        hrefLft.click(this.left.bind(this));
        hrefRgt.click(this.right.bind(this));

        // Misc
        inputGrpAddonIdx.prop('id', this.globalID() + '_idx');

        // Create Hierachy
        inputGrpAddonLft.append(hrefLft);
        inputGrpAddonRgt.append(hrefRgt);
        inputGrp.append(inputGrpAddonLft);
        inputGrp.append(inputGrpAddonIdx);
        inputGrp.append(inputGrpAddonRgt);
        formGroup.append(inputGrp);
        formInline.append(formGroup);

        // Has "+" function?
        if (this.callbackAdd) {
            hrefAdd.click(this.callbackAdd.bind(this));
            inputGrpAddonAdd.append(hrefAdd);
            inputGrp.append(inputGrpAddonAdd);
        }

        // Putting it together
        mainElem.append(table);
        mainElem.append(formInline);

        parentHtml.append(mainElem);
        callback();
    }

    updateViewWithDataFromModel(callback) {
        this.relationshipProxy.useRelationship(function(relnProxy) {
        // Create header:
            var thead = $('<thead></thead>');
            var tr = $('<tr></tr>');
            this.tableViewJson.tableItems.forEach(function(tableItem) {
                var th = $('<th>' + tableItem.label + '</th>');
                tr.append(th);
            });
            thead.append(tr);

            // Create body:
            var body = $('<tbody></tbody>');
            relnProxy.allQueryResults().forEach(function(entity) {
            // Create new row for each entity:
                tr = $('<tr></tr>');
                this.tableViewJson.tableItems.forEach(function(tableItem) {
                    var propertyID = tableItem.property[0];
                    var property = $warp.model.getPropertyByID(propertyID);
                    var td = $('<td>' + entity.getValue(property.name) + '</td>');
                    tr.append(td);
                });
                if (entity.isDocument) {
                    var target = { id: entity.data._id, type: entity.type, context: this.callbackContext };
                    tr.on('click', this.callbackRowSelected.bind(target));
                }
                body.append(tr);
            }.bind(this));

            // Putting it together:
            var table = $('#' + this.globalID() + "_table");
            table.empty();
            table.append(thead);
            table.append(body);

            // Update pagination menu:
            var from = relnProxy.currentPage * relnProxy.entitiesPerPage + 1;
            var to = Math.min(
                from + relnProxy.entitiesPerPage - 1,
                relnProxy.noOfTotalQueryResults());
            var idxStr = from + '-' + to + '/' + relnProxy.noOfTotalQueryResults();
            $('#' + this.globalID() + '_idx').html(idxStr);

            callback();
        }.bind(this));
    }

    updateModelWithDataFromView(callback) {
        callback();
    }

    selectPageAndUpdate(selection, callback) {
        this.updateModelWithDataFromView(function() {
            this.relationshipProxy.useRelationship(function(relnProxy) {
                switch (selection) {
                    case "+1":
                        relnProxy.incrementSelectedPage();
                        break;
                    case "-1":
                        relnProxy.decrementSelectedPage();
                        break;
                    default:
                        throw new Error("Invalid selection: " + selection);
                }
                relnProxy.useRelationship(function(relnProxy) {
                    this.updateViewWithDataFromModel(function() {
                        if (callback) {
                            callback();
                        }
                    });
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

    left() {
        utils.trace(1, "WarpTable.left():\n-  Left-Click for " + this.globalID());
        this.selectPageAndUpdate("-1");
    }

    right() {
        utils.trace(1, "WarpTable.right():\n-  Right-Click for " + this.globalID());
        this.selectPageAndUpdate("+1");
    }
}

module.exports = WarpTable;
