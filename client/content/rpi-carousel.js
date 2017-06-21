const utils = require('./../utils');
const WarpRelationshipPanelItem = require('./relationship-panel-item');

class RpiCarousel extends WarpRelationshipPanelItem {
    constructor(parent, config) {
        super(parent, config);
        this.childPageView = null;
        this.config = config;
    }

    init() {
    // Carousel needs a a PageView:
        var relnID = this.config.relationship[0];
        var reln = this.getWarpJSClient().model.getRelationshipByID(relnID);
        var targetEntity = this.getWarpJSClient().model.getEntityByID(reln.targetEntity[0]);

        var pv = null;
        if (this.config.view) {
            pv = this.config.view;
        } else { // Get default view
            pv = this.getWarpJSClient().model.getDefaultPageView(targetEntity);
        }
        pv.localID = "pv";
        pv.entityType = targetEntity.name;
        this.childPageView = this.getPageView().addChildPageView(this, pv);
    }

    createViews(parentHtml, callback) {
        var mainElem = $('<div></div>');

        this.panel = $('<div class="panel panel-success"></div>');
        this.panel.prop('id', this.globalID() + '_panel');

        var panelHeading = $('<div class="panel-heading"></div>');
        var panelBody = $('<div class="panel-body"></div>');

        var formInline = $('<form    class="form-inline"></form>');
        var formGroup = $('<div     class="form-group"></div>');
        var inputGrp = $('<div     class="input-group"></div>');
        var inputGrpAddonLft = $('<div     class="input-group-addon"></div>');
        var inputGrpAddonIdx = $('<div     class="input-group-addon">IDX</div>');
        var hrefLft = $('<a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a>');
        var inputGrpSelect = $('<select  class="form-control"></select>');
        var inputGrpAddonRgt = $('<div     class="input-group-addon"></div>');
        var hrefRgt = $('<a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a>');

        var inputGrpAddonAdd = $('<div     class="input-group-addon"></div>');
        var hrefAdd = $('<a href="#"><span class="glyphicon glyphicon-plus-sign"></span></a>');
        var inputGrpAddonDel = $('<div     class="input-group-addon"></div>');
        var hrefDel = $('<a href="#"><span class="glyphicon glyphicon-minus-sign"></span></a>');

        // Bind event handlers
        hrefLft.click(this.left.bind(this));
        hrefRgt.click(this.right.bind(this));
        hrefAdd.click(this.add.bind(this));
        hrefDel.click(this.del.bind(this));

        // Misc
        inputGrpSelect.prop('id', this.globalID() + '_select');
        inputGrpAddonIdx.prop('id', this.globalID() + '_idx');
        inputGrpSelect.change(this.select.bind(this));

        // Create Hierachy
        inputGrpAddonLft.append(hrefLft);
        inputGrpAddonRgt.append(hrefRgt);
        inputGrpAddonAdd.append(hrefAdd);
        inputGrpAddonDel.append(hrefDel);
        inputGrp.append(inputGrpAddonLft);
        inputGrp.append(inputGrpAddonIdx);
        inputGrp.append(inputGrpSelect);
        inputGrp.append(inputGrpAddonRgt);
        inputGrp.append(inputGrpAddonAdd);
        inputGrp.append(inputGrpAddonDel);
        formGroup.append(inputGrp);
        formInline.append(formGroup);
        panelHeading.append(formInline);
        this.panel.append(panelHeading);
        this.panel.append(panelBody);

        this.childPageView.createViews(panelBody, function() {
            mainElem.append(this.panel);

            // Alert to be shown in case relationship has no elements:
            var hrefAddAlert1 = $('<a href="#"><span class="glyphicon glyphicon-plus-sign"></span></a>');
            hrefAddAlert1.click(this.add.bind(this));
            this.alertEmpty = $('<div class="alert alert-info">Click here to add new element to \'' + this.label + '\': </div>');
            this.alertEmpty.prop('id', this.globalID() + '_alertEmpty');
            this.alertEmpty.append(hrefAddAlert1);

            // Alert to be shown in case parent is new:
            this.alertNew = $('<div class="alert alert-warning">Save new element first before adding to \'' + this.label + '\'!</div>');
            this.alertNew.prop('id', this.globalID() + '_alertNew');

            mainElem.append(this.alertEmpty);
            mainElem.append(this.alertNew);

            parentHtml.append(mainElem);
            callback();
        }.bind(this));
    }

    updateViewWithDataFromModel(callback) {
        var rp = this.getRelationshipProxy();
        rp.useRelationship(function(relnProxy) {
            this.alertEmpty.hide();
            this.alertNew.hide();
            this.panel.hide();
            if (relnProxy.noOfTotalQueryResults() === 0) {
                var ep = this.getPageView().getEntityProxy();
                if (ep.mode === "addNewEntity") {
                    this.alertNew.show();
                } else {
                    this.alertEmpty.show();
                }
                callback();
            } else {
                this.panel.show();

                var from = -1;
                var to = -1;
                var idx = -1;
                var idxStr = "";
                if (relnProxy.targetIsDocument) {
                    from = 1 + relnProxy.currentPage * relnProxy.entitiesPerPage;
                    to = Math.min(
                        from + relnProxy.entitiesPerPage - 1,
                        relnProxy.noOfTotalQueryResults());

                    idx = relnProxy.selectedEntityIdx + from;
                } else {
                    from = 1;
                    to = relnProxy.noOfTotalQueryResults();
                    idx = relnProxy.entitiesPerPage * relnProxy.currentPage + relnProxy.selectedEntityIdx + 1;
                }
                idxStr = idx + "/" + relnProxy.noOfTotalQueryResults();

                $('#' + this.globalID() + '_idx').html(idxStr);

                // Update selection list
                var select = $('#' + this.globalID() + '_select');
                select.empty();
                var option = $('<option>Showing matches from ' + from + ' to ' + to + '</option>');
                select.append(option);
                option = $('<option>---------------------</option>');
                select.append(option);
                relnProxy.allQueryResults().forEach(function(entity, idx) {
                    if (entity && entity.data) {
                        option = $('<option>' + entity.displayName() + '</option>');
                        option.prop('value', idx);
                        select.append(option);
                    } else {
                        utils.trace(2, "RpiCarousel.updateViewWithDataFromModel():\n-  Warning - can't access query result!");
                    }
                });
                if (relnProxy.targetIsDocument) {
                    select.val(relnProxy.selectedEntityIdx);
                } else {
                    select.val(idx - 1);
                }

                // Now update the page contained within
                this.childPageView.updateViewWithDataFromModel(callback);
            }
        }.bind(this));
    }

    updateModelWithDataFromView(callback) {
        if (this.childPageView) {
            this.childPageView.updateModelWithDataFromView(callback);
        } else {
            utils.trace(1, "RpiCarousel.left():\n-  Warning - RelationshipPanelItem without PageView! (ID:" + this.globalID() + ")");
            callback();
        }
    }

    selectEntityAndUpdate(selection) {
        this.updateModelWithDataFromView(function() {
            this.getRelationshipProxy().useRelationship(function(relnProxy) {
                switch (selection) {
                    case "+1":
                        relnProxy.incrementEntitySelection();
                        break;
                    case "-1":
                        relnProxy.decrementEntitySelection();
                        break;
                    case "last":
                        relnProxy.setSelectedEntity("last");
                        break;
                    default:
                        if (typeof selection !== "number") {
                            throw new Error("Invalid selection: " + selection);
                        }
                        if (relnProxy.targetIsDocument) {
                            relnProxy.setSelectedEntity(selection);
                        } else {
                            var page = Math.floor(selection / relnProxy.entitiesPerPage);
                            var pos = selection - page * relnProxy.entitiesPerPage;
                            relnProxy.currentPage = page;
                            relnProxy.setSelectedEntity(pos);
                        }
                }

                relnProxy.useRelationship(function(relnProxy) {
                    var proxyForSelectedEntity = relnProxy.getProxyForSelectedEntity();
                    this.childPageView.reset(this.childPageView.config, proxyForSelectedEntity);
                    this.childPageView.initialize(function() {
                        var parentElem = $('#' + this.getParent().globalID());
                        parentElem.empty();
                        this.createViews(parentElem, function() {
                            this.getParent().updateViewWithDataFromModel(function() {
                                utils.trace(2, "--------------- Updated View Hierarchy ---------------");
                                utils.trace(2, $warp.pageView.toString());
                                utils.trace(2, "--------------- ---------------------- ---------------");
                            });
                        }.bind(this));
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }.bind(this));
    }

    select(e) {
        utils.trace(1, "RpiCarousel.select():\n-  New selection for " + this.globalID());
        var idx = parseInt(e.target.value);
        this.selectEntityAndUpdate(idx);
    }

    left() {
        utils.trace(1, "RpiCarousel.left():\n-  Left-Click for " + this.globalID());
        this.selectEntityAndUpdate("-1");
    }

    right() {
        utils.trace(1, "RpiCarousel.right():\n-  Right-Click for " + this.globalID());
        this.selectEntityAndUpdate("+1");
    }

    add() {
        utils.trace(1, "RpiCarousel.add():\n-  (+)-Click for " + this.globalID());
        var pv = this.getPageView();
        var ep = pv.getEntityProxy();
        if (this.relnDetails.targetJson.entityType === "Document") {
            ep.addNewDocument(this.relationshipID);
        } else {
            var rp = this.getRelationshipProxy();
            rp.addNewEmbeddedEntity(null, function() {
                this.updateModelWithDataFromView(function() {
                    this.selectEntityAndUpdate(("last"));
                }.bind(this));
            }.bind(this));
        }
    }

    del() {
        utils.trace(1, "RpiCarousel.del():\n-  (-)-Click for " + this.globalID());
    }
}

module.exports = RpiCarousel;
