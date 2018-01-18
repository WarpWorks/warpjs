const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, entity, instance, docLevel, relativeToDocument) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        name: entity.name,
        desc: entity.desc,
        type: entity.type,
        id: entity.idToJSON(),
        defaultValue: entity.defaultValue,
        constraints: entity.constraints,
        examples: entity.examples,
        propertyType: entity.propertyType,
        inputType: entity.inputType,
        value: entity.getValue(instance),
        docLevel: docLevel.join('.')
    }))
    .then((resource) => Promise.resolve()
        .then(() => resource)
    )
;
