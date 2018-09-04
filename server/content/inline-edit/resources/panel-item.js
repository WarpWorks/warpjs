const debug = require('debug')('W2:content:inline-edit/resources/panel-item');
const Promise = require('bluebird');

const ComplexTypes = require('./../../../../lib/core/complex-types');
const basicPropertyPanelItemResource = require('./panel-item-basic-property');
const relationshipPanelItemResource = require('./panel-item-relationship');

module.exports = (persistence, panelItem, instance) => Promise.resolve()
    .then(() => {
        if (panelItem.type === ComplexTypes.BasicPropertyPanelItem) {
            return basicPropertyPanelItemResource(persistence, panelItem, instance);
        } else if (panelItem.type === ComplexTypes.RelationshipPanelItem) {
            return relationshipPanelItemResource(persistence, panelItem, instance);
        } else if (panelItem.type === ComplexTypes.SeparatorPanelItem) {
            return null;
        } else if (panelItem.type === ComplexTypes.EnumPanelItem) {
            return null;
        } else {
            debug(`TODO: panelItem.type=${panelItem.type}`);
        }
    })
;
