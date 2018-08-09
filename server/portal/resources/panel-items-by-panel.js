const debug = require('debug')('W2:portal:resources/panel-items-by-panel');
const Promise = require('bluebird');

const BasicPropertyPanelItemResource = require('./basic-property-panel-item');
const ComplexTypes = require('./../../../lib/core/complex-types');
const EnumPanelItemResource = require('./enum-panel-item');
const RelationshipPanelItemResource = require('./relationship-panel-item');
const SeparatorPanelItemResource = require('./separator-panel-item');

module.exports = (persistence, panel, instance) => Promise.resolve()
    .then(() => panel.getPanelItems())
    .then((panelItems) => Promise.map(
        panelItems,
        (panelItem) => Promise.resolve()
            // .then(() => debug(`panelItem: name:${panelItem.name}; position:${panelItem.position}`))
            .then(() => {
                if (panelItem.type === ComplexTypes.BasicPropertyPanelItem) {
                    return BasicPropertyPanelItemResource(persistence, panelItem, instance);
                } else if (panelItem.type === ComplexTypes.RelationshipPanelItem) {
                    return RelationshipPanelItemResource(persistence, panelItem, instance);
                } else if (panelItem.type === ComplexTypes.EnumPanelItem) {
                    return EnumPanelItemResource(persistence, panelItem, instance);
                } else if (panelItem.type === ComplexTypes.SeparatorPanelItem) {
                    return SeparatorPanelItemResource(persistence, panelItem, instance);
                } else {
                    debug(`TODO: panelItem.type === ${panelItem.type}`, panelItem);
                }
            })
    ))
    .then((panelItemResources) => panelItemResources.filter((panelItemResource) => panelItemResource.showItem))
    .then((panelItemResources) => {
        // We want to make sure that the list doesn't end with a separator.
        while (true) {
            const len = panelItemResources.length;
            if (len && panelItemResources[len - 1].isOfType.SeparatorPanelItem) {
                panelItemResources.pop();
            } else {
                break;
            }
        }
        return panelItemResources;
    })
;
