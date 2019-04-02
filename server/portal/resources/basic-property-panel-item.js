const isUndefined = require('lodash/isUndefined');
const warpjsUtils = require('@warp-works/warpjs-utils');

const basePanelItemInfo = require('./base-panel-item-info');
const BasicTypes = require('./../../../lib/core/basic-types');
const constants = require('./constants');
const convertCustomLinks = require('./convert-custom-links');
// const debug = require('./debug')('basic-property-panel-item');

module.exports = async (persistence, panelItem, instance) => {
    const resourceInfo = basePanelItemInfo(panelItem);
    const resource = warpjsUtils.createResource('', resourceInfo);

    const basicProperty = panelItem.hasBasicProperty() ? panelItem.getBasicProperty() : null;

    if (basicProperty) {
        resource.propertyName = basicProperty.name;
        resource.propertyType = basicProperty.propertyType;
        resource.typeOfProperty = constants.isOfPropertyType(basicProperty.propertyType);

        const value = basicProperty.getValue(instance);
        resource.value = (resource.propertyType === BasicTypes.Text) ? convertCustomLinks(value) : value;
        resource.showItem = !isUndefined(resource.value) && resource.value !== '';
    }
    return resource;
};
