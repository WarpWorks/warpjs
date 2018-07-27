// const debug = require('debug')('W2:portal:resources/enum-panel-item');
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
        .then(() => panelItem.hasEnumeration() ? panelItem.getEnumeration() : null)
        .then((enumeration) => {
            if (enumeration) {
                resource.propertyName = enumeration.name;
                resource.propertyType = enumeration.type;
                resource.value = enumeration.getValue(instance);
            }
        })
        .then(() => resource)
    )
;
