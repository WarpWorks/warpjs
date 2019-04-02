const Promise = require('bluebird');

const BasicPropertyPanelItemResource = require('./basic-property-panel-item');
const ComplexTypes = require('./../../../lib/core/complex-types');
const debug = require('./debug')('panel-items-by-panel');
const EnumPanelItemResource = require('./enum-panel-item');
const RelationshipPanelItemResource = require('./relationship-panel-item');
const SeparatorPanelItemResource = require('./separator-panel-item');

module.exports = async (persistence, panel, instance) => {
    const panelItems = panel.getPanelItems();
    const panelItemResources = await Promise.map(
        panelItems,
        async (panelItem) => {
            // debug(`panelItem: name:${panelItem.name}; position:${panelItem.position}`);
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
        }
    );

    const filteredPanelItemResources = panelItemResources.filter((panelItemResource) => panelItemResource.showItem);

    // We want to make sure that the list doesn't end with a separator.
    while (true) {
        const len = filteredPanelItemResources.length;
        if (len && filteredPanelItemResources[len - 1].isOfType.SeparatorPanelItem) {
            filteredPanelItemResources.pop();
        } else {
            break;
        }
    }
    return filteredPanelItemResources;
};
