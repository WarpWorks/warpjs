const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const formResource = require('./basic-property');

module.exports = (persistence, entity, instance, docLevel, relativeToDocument) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        name: entity.name,
        desc: entity.desc,
        type: entity.type,
        id: entity.idToJSON(),
        position: entity.position,
        label: entity.label,
        readOnly: entity.readOnly,
        isFormItem: true,
        docLevel: docLevel.join('.')
    }))
    .then((resource) => Promise.resolve()
        .then(() => {
            if (entity.hasBasicProperty()) {
                const basicProperty = entity.getBasicProperty();
                return formResource(persistence, basicProperty, instance, docLevel.concat(`Basic:${basicProperty.name}`), relativeToDocument);
            }
        })
        .then((model) => {
            resource.model = model;
        })
        .then(() => resource)
    )
;
