// const debug = require('debug')('W2:portal:resources/basic-property-panel-item');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, panelItem, instance) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        type: panelItem.type,
        id: panelItem.id,
        name: panelItem.name,
        description: panelItem.desc,
        label: panelItem.label || panelItem.name
    }))
    .then((resource) => Promise.resolve()
        .then(() => panelItem.hasBasicProperty() ? panelItem.getBasicProperty() : null)
        .then((basicProperty) => {
            if (basicProperty) {
                resource.propertyName = basicProperty.name;
                resource.propertyType = basicProperty.propertyType;
                resource.value = basicProperty.getValue(instance);
            }
        })
        .then(() => resource)
    )
;
