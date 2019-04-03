const isUndefined = require('lodash/isUndefined');
const warpjsUtils = require('@warp-works/warpjs-utils');

const basePanelItemInfo = require('./base-panel-item-info');
// const debug = require('./debug')('enum-panel-item');

module.exports = async (persistence, panelItem, instance) => {
    const resourceInfo = await basePanelItemInfo(panelItem);
    const resource = warpjsUtils.createResource('', resourceInfo);
    const enumeration = panelItem.hasEnumeration() ? panelItem.getEnumeration() : null;

    resource.showItem = Boolean(enumeration && !isUndefined(resource.value) && resource.value.trim() !== '');
    if (enumeration) {
        resource.propertyName = enumeration.name;
        resource.propertyType = enumeration.type;
        resource.value = enumeration.getValue(instance);
    }

    return resource;
};
