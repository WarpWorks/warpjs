const utils = require('./../utils');
const WarpAssociationEditor = require('./association-editor');
const WarpRelationshipPanelItem = require('./relationship-panel-item');

class rpiCSV extends WarpRelationshipPanelItem {
    constructor(parent, config) {
        if (config.isAggregation) {
            throw new Error("Style 'CSV' currently only supported for associations!");
        }
        super(parent, config);
    }

    createViews(parentHtml, callback) {
        var form = $('<form class="form-horizontal"></form>');
        var formGroup = $('<div class="form-group"></div>');

        var label = $('<label></label>');
        label.prop('for', this.globalID());
        label.prop('class', 'col-sm-2 control-label');
        label.text(this.label);

        var csvDiv = $('<div></div>');
        csvDiv.prop('class', 'col-sm-10');

        this.csv = $('<ul class="nav nav-pills"></ul>');
        this.csv.prop('id', this.globalID() + '_csv');

        csvDiv.append(this.csv);
        form.append(formGroup);
        formGroup.append(label);
        formGroup.append(csvDiv);

        parentHtml.append(form);

        this.updateCSVs(function() {
            callback();
        });
    }

    updateCSVs(callback) {
        if (this.relnDetails.relnJson.isAggregation) {
            this.updateAggregationCSVs(callback);
        } else {
            this.updateAssociationCSVs(callback);
        }
    }

    updateAssociationCSVs(callback) {
        this.csv.empty();
        var rp = this.getRelationshipProxy();
        rp.useRelationship(function(assocProxy) {
            var idx = 0;
            var max = assocProxy.noOfResultsOnCurrentPage();

            var createElems = function() {
                if (idx < max) {
                    assocProxy.queryResult(idx).useData(function(proxy) {
                        var name = proxy.displayName();
                        var targetID = proxy.data._id;
                        var desc = assocProxy.getAssocDataByTargetID(targetID).desc;
                        var li = $('<li><a href="#">' + name + '</a></li>');
                        if (desc !== "") {
                            li.prop('title', desc);
                        }
                        li.on('click', function() {
                            $warp.openInNewPage(this.targetID, this.targetType);
                        }.bind({targetID: targetID, targetType: proxy.type}));
                        this.csv.append(li);

                        idx++;
                        createElems();
                    }.bind(this));
                } else {
                    var liBtn = $('<li><a href="#" id="aggregationTargetNameItem"><span class="glyphicon glyphicon-list-alt"></span></a></li>');
                    liBtn.on('click', this.openAssociationEditor.bind(this));
                    this.csv.append(liBtn);

                    callback();
                }
            }.bind(this);

            createElems();
        }.bind(this));
    }

    updateAggregationCSVs(callback) {
        this.csv.empty();
        var rp = this.getRelationshipProxy();
        rp.useRelationship(function(aggProxy) {
            var idx = 0;
            var max = aggProxy.noOfResultsOnCurrentPage();

            var createElems = function() {
                if (idx < max) {
                    aggProxy.queryResult(idx).useData(function(proxy) {
                        var name = proxy.displayName();
                        var targetID = proxy.data._id;
                        var li = $('<li><a href="#">' + name + '</a></li>');
                        li.on('click', function() {
                            $warp.openInNewPage(this.targetID, this.targetType);
                        }.bind({targetID: targetID, targetType: proxy.type}));
                        this.csv.append(li);

                        idx++;
                        createElems();
                    }.bind(this));
                } else {
                    if (aggProxy.targetEntityDefinition.entityType === 'Document') {
                        var targetMax = parseInt(aggProxy.jsonReln.targetMax);
                        var aggCount = aggProxy.noOfTotalQueryResults();
                        if (isNaN(targetMax) || aggCount < targetMax) {
                            var liBtn = $('<li><a href="#" id="aggregationTargetNameItem"><span class="glyphicon glyphicon-plus-sign"></span></a></li>');
                            liBtn.on('click', function() {
                                var pv = this._parent.getPageView();
                                var ep = pv.getEntityProxy();
                                ep.addNewDocument(this.relationshipID);
                            }.bind(this));
                            this.csv.append(liBtn);
                        }
                    }
                    callback();
                }
            }.bind(this);

            createElems();
        }.bind(this));
    }

    openAssociationEditor() {
        var pv = this.getPageView();
        var sourceEntityProxy = pv.getEntityProxy();
        var assocEditor = new WarpAssociationEditor(this, sourceEntityProxy, this.relationshipID, this.globalID() + "_edit");
        assocEditor.init();
    }

    updateViewWithDataFromModel(callback) {
        this.updateCSVs(callback);
    }

    updateModelWithDataFromView(callback) {
        utils.trace(2, "rpiCSV.updateModelWithDataFromView():\n-  Warning - 'updateModelWithDataFromView' for 'rpiCSV' currently not implemented!");
        callback();
    }
}

module.exports = rpiCSV;
