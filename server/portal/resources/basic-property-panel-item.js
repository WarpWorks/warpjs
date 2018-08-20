const _ = require('lodash');
// const debug = require('debug')('W2:portal:resources/basic-property-panel-item');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const basePanelItemInfo = require('./base-panel-item-info');
const BasicTypes = require('./../../../lib/core/basic-types');
const constants = require('./constants');
const convertCustomLinks = require('./convert-custom-links');

module.exports = (persistence, panelItem, instance) => Promise.resolve()
    .then(() => basePanelItemInfo(panelItem))
    .then((basePanelItemInfo) => _.extend({}, basePanelItemInfo, {
    }))
    .then((resourceInfo) => warpjsUtils.createResource('', resourceInfo))
    .then((resource) => Promise.resolve()
        .then(() => panelItem.hasBasicProperty() ? panelItem.getBasicProperty() : null)
        .then((basicProperty) => {
            if (basicProperty) {
                resource.propertyName = basicProperty.name;
                resource.propertyType = basicProperty.propertyType;
                resource.typeOfProperty = constants.isOfPropertyType(basicProperty.propertyType);

                const value = basicProperty.getValue(instance);
                resource.value = (resource.propertyType === BasicTypes.Text) ? convertCustomLinks(value) : value;
                resource.showItem = !_.isUndefined(resource.value);
            }
        })
        .then(() => resource)
    )
;
