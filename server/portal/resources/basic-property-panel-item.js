const _ = require('lodash');
// const debug = require('debug')('W2:portal:resources/basic-property-panel-item');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const basePanelItemInfo = require('./base-panel-item-info');

module.exports = (persistence, panelItem, instance) => Promise.resolve()
    .then(() => basePanelItemInfo(panelItem))
    .then((basePanelItemInfo) => _.extend({}, basePanelItemInfo, {
    }))
    .then((resourceInfo) => warpjsUtils.createResource('', resourceInfo))
    .then((resource) => Promise.resolve()
        .then(() => panelItem.hasBasicProperty() ? panelItem.getBasicProperty() : null)
        .then((basicProperty) => {
            if (basicProperty) {
                resource.showItem = true;
                resource.propertyName = basicProperty.name;
                resource.propertyType = basicProperty.propertyType;
                resource.value = basicProperty.getValue(instance);
            }
        })
        .then(() => resource)
    )
;
