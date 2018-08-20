const _ = require('lodash');
// const debug = require('debug')('W2:portal:resources/enum-panel-item');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const basePanelItemInfo = require('./base-panel-item-info');

module.exports = (persistence, panelItem, instance) => Promise.resolve()
    .then(() => basePanelItemInfo(panelItem))
    .then((basePanelItemInfo) => _.extend({}, basePanelItemInfo, {
    }))
    .then((resourceInfo) => warpjsUtils.createResource('', resourceInfo))
    .then((resource) => Promise.resolve()
        .then(() => panelItem.hasEnumeration() ? panelItem.getEnumeration() : null)
        .then((enumeration) => {
            if (enumeration) {
                resource.propertyName = enumeration.name;
                resource.propertyType = enumeration.type;
                resource.value = enumeration.getValue(instance);
                resource.showItem = !_.isUndefined(resource.value) && resource.value.trim() !== '';
            }
        })
        .then(() => resource)
    )
;
