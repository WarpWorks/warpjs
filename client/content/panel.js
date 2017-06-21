const RpiCarousel = require('./rpi-carousel');
const RpiCSV = require('./rpi-csv');
const RpiTable = require('./rpi-table');
const WarpBasicPropertyPanelItem = require('./basic-property-panel-item');
const WarpEnumPanelItem = require('./enum-panel-item');
const WarpPanelItem = require('./panel-item');
const WarpWidget = require('./widget');

class WarpPanel extends WarpWidget {
    constructor(parent, config) {
        super(parent, config);
        this.position = parseInt('' + config.position);
        this.label = config.label;
        this.panelItems = [];
        this.actions = config.actions;
    }

    updateViewWithDataFromModel(callback) {
        var context = {
            idx: -1,
            panel: this
        };
        var performUpdates = function() {
            if (this.idx + 1 < this.panel.panelItems.length) {
                this.idx++;
                this.panel.panelItems[this.idx].updateViewWithDataFromModel(performUpdates.bind(this));
            } else {
                callback();
            }
        }.bind(context);

        performUpdates();
    }

    updateModelWithDataFromView(callback) {
        var context = {
            idx: -1,
            panel: this
        };
        var performUpdates = function() {
            if (this.idx + 1 < this.panel.panelItems.length) {
                this.idx++;
                this.panel.panelItems[this.idx].updateModelWithDataFromView(performUpdates.bind(this));
            } else {
                callback();
            }
        }.bind(context);

        performUpdates();
    }

    addSeparatorPanelItem(config) {
        var pi = new WarpPanelItem(this, "Separator", config);
        this.panelItems.push(pi);
        return pi;
    }

    addBasicPropertyPanelItem(config) {
        var pi = new WarpBasicPropertyPanelItem(this, config);
        this.panelItems.push(pi);
        return pi;
    }

    addEnumPanelItem(config) {
        var pi = new WarpEnumPanelItem(this, config);
        this.panelItems.push(pi);
        return pi;
    }

    addRelationshipPanelItem(config) {
        var pi = null;
        switch (config.style) {
            case 'CSV':
            // Special class to handle Comma Separated Values
                pi = new RpiCSV(this, config);
                break;
            case 'Carousel':
            // Special class to handle Carousel-Style display (one entity / page)
                pi = new RpiCarousel(this, config);
                pi.init();
                break;
            case 'Table':
                pi = new RpiTable(this, config);
                pi.init();
                break;
            default:
                throw new Error("Unknown style for RelationshipProxy PanelItem: " + config.style);
        }
        this.panelItems.push(pi);

        return pi;
    }

    createViews(parentHtml, callback) {
        var panel = $('<div></div>');
        if (parentHtml.hasClass('tab-content')) {
            panel.prop('class', 'tab-pane fade in' + (this.position === 0 ? ' active' : ''));
        }
        panel.prop('id', this.globalID());

        var form = $('<form class="form-horizontal"></form>');
        panel.append(form);

        var idx = 0;
        var max = this.panelItems.length;

        var createPanelItemViews = function() {
            if (idx < max) {
                var panelItem = this.panelItems[idx++];
                if (panelItem.isFormItem()) {
                    panelItem.createViews(form, function() {
                        createPanelItemViews();
                    });
                } else {
                    panelItem.createViews(panel, function() {
                        createPanelItemViews();
                    });
                }
            } else {
                if (this.actions.length > 0) {
                    var pe = this.getPageView().getEntityProxy();
                    pe.useData(function(entityProxy) {
                        var btnGrp = $('<div class="btn-group btn-group-sm">');
                        this.actions.forEach(function(action) {
                            var button = $('<button type="button" class="btn btn-default">Action</button>');
                            var icon = action.icon.includes('glyphicon') ? '<span class="glyphicon ' + action.icon + '" aria-hidden="true"></span> ' : "";
                            button.html(icon + action.label);
                            button.on("click", function(event) {
                                this.warpPanel.getPageView().updateModelWithDataFromView(function() {
                                // Call function specified in the definition of the action:
                                    window[action.functionName](this);
                                }.bind(this));
                            }.bind({entityProxy: entityProxy, warpPanel: this}));
                            btnGrp.append(button);
                        }.bind(this));
                        panel.append("<hr>");
                        panel.append(btnGrp);
                    }.bind(this));
                }

                parentHtml.append(panel);
                callback();
            }
        }.bind(this);

        createPanelItemViews();
    }
}

module.exports = WarpPanel;
