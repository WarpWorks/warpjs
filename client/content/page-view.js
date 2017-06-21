const utils = require('./../utils');
const WarpPanel = require('./panel');
const WarpWidget = require('./widget');

class WarpPageView extends WarpWidget {
    constructor(parent, config) {
        super(parent, config);
        this.reset(config);
    }

    reset(config, entityProxy) {
        if (!config || !config.entityType) {
            throw new Error("PageView must have config and entityType!");
        }
        this.entityType = config.entityType;
        this.config = config;
        this.label = config.label;
        this.style = config.style;

        this.panels = [];
        this._addPanelsRequired = true;

        this._entityProxy = entityProxy;
        this._relnProxies = [];
        this._relnProxyIdx = -1;

        this._childPageViews = [];
        this._childPageViewIdx = -1;
    }

    // Overwrite defaults:
    getPageView() {
        return this;
    }

    getEntityProxy() {
        return this._entityProxy;
    }

    setEntityProxy(entity) {
        this._entityProxy = entity;
    }

    initialize(callback) {
        if (!this._entityProxy) {
            throw new Error("Must set EntityProxy first before initializing PageView!");
        }

        // Create Panels
        if (this._addPanelsRequired) {
            this._addPanelsRequired = false;
            for (var idx = 0; this.config.panels && idx < this.config.panels.length; idx++) {
                var panel = this.config.panels[idx];
                panel.localID = "panel" + idx;
                this.addPanel(panel);
            }
        }

        // Load data for own Entity Proxy
        if (!this._entityProxy.data) {
            this._entityProxy.useData(function(entityProxy) {
                utils.trace(1, "WarpPageView.initialize", "Loaded data for: " + this.getEntityProxy().displayName());
                this.initialize(callback);
            }.bind(this));
        } else {
            if (this.isToplevelPageView) {
                $('#NavButtonView').attr('href', this._entityProxy.viewUrl);
            }
            // Load data for all relationships used by this PageView
            if (this._relnProxyIdx === -1) {
                this._relnProxyIdx = 0;
            }
            if (this._relnProxyIdx < this._relnProxies.length) {
                this._relnProxies[this._relnProxyIdx++].useRelationship(function(relnProxy) {
                // Don't need to do anything; just ensure the data is loaded
                    utils.trace(1, "WarpPageView.initialize", "Loading relationship data for: " + this.getEntityProxy().displayName() + ', ' + relnProxy.name);
                    this.initialize(callback);
                }.bind(this));
            } else {
            // Initialize child PageViews
                if (this._childPageViewIdx === -1) {
                    this._childPageViewIdx = 0;
                }
                if (this._childPageViewIdx < this._childPageViews.length) {
                    var childPageView =
                    this._childPageViews[this._childPageViewIdx++];
                    var relnProxyForChildPV =
                    this.getEntityProxy().getRelationshipProxy(childPageView.parentRelationshipID);
                    if (relnProxyForChildPV.noOfResultsOnCurrentPage() === 0) {
                        utils.trace(1, "WarpPageView.initialize():\n- No elements found in relationship '" + relnProxyForChildPV.name + "'");
                        this.initialize(callback);
                    } else {
                        childPageView.setEntityProxy(relnProxyForChildPV.getProxyForSelectedEntity());
                        childPageView.initialize(function() {
                            this.initialize(callback);
                        }.bind(this));
                    }
                } else {
                    // Done!
                    utils.trace(1, "WarpPageView.initialize", "Final callback for: " + this.getEntityProxy().displayName());
                    callback();
                }
            }
        }
    }

    toString(spacing) {
        if (!spacing) {
            spacing = 1;
        }
        var spaces = "";
        for (var idx = 0; idx < spacing; idx++) {
            spaces += " ";
        }
        var str = "\n" + spaces;
        if (this.getEntityProxy()) {
            var dn = this.entityType;
            if (this.getEntityProxy().data) {
                dn = this.getEntityProxy().displayName();
                dn += " (" + (this.getEntityProxy().isDocument ? "Document" : "Embedded") + ")";
            }
            str += "* PageView [type=" + this.entityType + ", widgetID=" + this._wID + "]:";
            str += "\n" + spaces + "  - " + "EntityProxy: " + dn;
        } else {
            str += "* " + this.globalID() + " - no EntityProxy!";
        }
        this._relnProxies.forEach(function(rp) {
            str += rp.toString(spacing + 1);
        });
        this._childPageViews.forEach(function(pv) {
            str += pv.toString(spacing + 2);
        });
        return str;
    }

    addChildPageView(panelItem, config) {
        var pv = new WarpPageView(panelItem, config);
        pv.parentRelationshipID = panelItem.relationshipID;
        this._childPageViews.push(pv);
        return pv;
    }

    addRelationship(relnID) {
        var newReln = this.getEntityProxy().getRelationshipProxy(relnID);
        this._relnProxies.push(newReln);
        return newReln;
    }

    updateViewWithDataFromModel(callback) {
        var context = {
            idx: -1,
            pv: this
        };
        var performUpdates = function() {
            if (this.idx + 1 < this.pv.panels.length) {
                this.idx++;
                this.pv.panels[this.idx].updateViewWithDataFromModel(performUpdates.bind(this));
            } else {
                callback();
            }
        }.bind(context);
        performUpdates();
    }

    updateModelWithDataFromView(callback) {
        var context = {
            idx: -1,
            pv: this
        };
        var performUpdates = function() {
            if (this.idx + 1 < this.pv.panels.length) {
                this.idx++;
                this.pv.panels[this.idx].updateModelWithDataFromView(performUpdates.bind(this));
            } else {
                callback();
            }
        }.bind(context);
        performUpdates();
    }

    addPanel(config) {
        var idx;

        var newPanel = new WarpPanel(this, config);
        this.panels.push(newPanel);

        for (idx = 0; config.separatorPanelItems && idx < config.separatorPanelItems.length; idx++) {
            var separatorPanelItem = config.separatorPanelItems[idx];
            separatorPanelItem.localID = "sItem" + idx;
            newPanel.addSeparatorPanelItem(separatorPanelItem);
        }
        for (idx = 0; config.basicPropertyPanelItems && idx < config.basicPropertyPanelItems.length; idx++) {
            var basicPropertyPanelItem = config.basicPropertyPanelItems[idx];
            basicPropertyPanelItem.localID = "bpItem" + idx;
            newPanel.addBasicPropertyPanelItem(basicPropertyPanelItem);
        }
        for (idx = 0; config.enumPanelItems && idx < config.enumPanelItems.length; idx++) {
            var enumPanelItem = config.enumPanelItems[idx];
            enumPanelItem.localID = "enumItem" + idx;
            newPanel.addEnumPanelItem(enumPanelItem);
        }
        for (idx = 0; config.relationshipPanelItems && idx < config.relationshipPanelItems.length; idx++) {
            var relationshipPanelItem = config.relationshipPanelItems[idx];
            relationshipPanelItem.localID = "relnItem" + idx;
            newPanel.addRelationshipPanelItem(relationshipPanelItem);
        }

        return newPanel;
    }

    createViews(parentHtml, callback) {
        var bodyContent = null;
        if (this.panels.length > 1) {
            var navTabs = $('<ul class="nav nav-tabs"></ul>');
            this.panels.forEach(function(panel) {
                var tab = $('<li></li>');
                if (panel.position === 0) {
                    tab.prop('class', 'active');
                }

                var href = $('<a data-toggle="tab"></a>');
                href.prop('href', '#' + panel.globalID());
                href.text(panel.label);

                navTabs.append(tab);
                tab.append(href);
            });
            bodyContent = $('<div class="tab-content"></div>');
            bodyContent.append(navTabs);
        } else {
            bodyContent = $('<div></div>');
        }
        bodyContent.prop('style', this.isToplevelPageView ? '' : 'padding: 10px;');

        var idx = 0;
        var max = this.panels.length;

        var createPanelViews = function() {
            if (idx < max) {
                var p = this.panels[idx++];
                p.createViews(bodyContent, function() {
                    createPanelViews();
                });
            } else {
                if (this.isToplevelPageView) {
                    this.getEntityProxy().useData(function(entityProxy) {
                        var headingTxt = entityProxy.type + ": " + entityProxy.displayName();

                        var panel = $('<div class="panel panel-success"></div>');
                        panel.prop('id', this.globalID() + '_panel');

                        var panelHeading = $('<div class="panel-heading"></div>');
                        panelHeading.html(headingTxt);
                        var addSibbling = $('<a href="#" id="addEntityA" data-toggle="tooltip" title="Add sibling"><span class="glyphicon glyphicon-share pull-right"></span></a>');
                        addSibbling.on('click', function() {
                            this.getEntityProxy().addSibling();
                        }.bind(this));
                        panelHeading.append(addSibbling);

                        var panelBody = $('<div class="panel-body"></div>');
                        panelBody.append(bodyContent);
                        panel.append(panelHeading).append(panelBody);
                        parentHtml.append(panel);
                    }.bind(this));
                } else {
                    parentHtml.append(bodyContent);
                }

                callback();
            }
        }.bind(this);

        createPanelViews();
    }
}

module.exports = WarpPageView;
