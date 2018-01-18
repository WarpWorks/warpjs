const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const formResource = require('./relationship');

module.exports = (persistence, entity, instance, docLevel, relativeToDocument) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        name: entity.name,
        desc: entity.desc,
        type:  entity.type,
        id: entity.idToJSON(),
        position: entity.position,
        label: entity.label,
        readOnly: entity.readOnly,
        style: entity.style,
        isFormItem: (entity.style === 'csv'),
        docLevel: docLevel.join('.')
    }))
    .then((resource) => Promise.resolve()
        .then(() => entity.getRelationship())
        .then((relationship) => formResource(persistence, relationship, instance, docLevel, relativeToDocument))
        .then((relationship) => {
            resource.relationship = relationship;
        })

        .then(() => resource)
    )
;
