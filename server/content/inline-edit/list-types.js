const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const EntityTypes = require('./../../../lib/core/entity-types');

module.exports = (persistence, entity, instance, body, instanceResource) => Promise.resolve()
    .then(() => entity.getRelationshipById(body.reference.id))
    .then((childRelationship) => Promise.resolve()
        .then(() => childRelationship.getDocuments(persistence, instance))
        .then((associations) => associations.sort(warpjsUtils.byName))
        .then((associations) => associations.map((association) => warpjsUtils.createResource('', {
            type: association.type,
            id: association.id,
            name: childRelationship.getDisplayName(association),
            description: association.relnDesc,
            position: association.relnPosition
        })))
        .then((associations) => instanceResource.embed('associations', associations))

        .then(() => childRelationship.getTargetEntity())
        .then((childEntity) => Promise.resolve()
            .then(() => childEntity.getChildEntities(true, true))
            .then((childEntities) => childEntities.concat(childEntity))
            .then((childEntities) => childEntities.filter((childEntity) => !childEntity.isAbstract))
            .then((childEntities) => childEntities.filter((childEntity) => childEntity.entityType === EntityTypes.DOCUMENT))
            .then((childEntities) => childEntities.sort(warpjsUtils.byName))
            .then((childEntities) => childEntities.map((childEntity) => warpjsUtils.createResource('', {
                id: childEntity.id,
                name: childEntity.label || childEntity.name
            })))
            .then((childEntities) => instanceResource.embed('types', childEntities))
            .then(() => {
                if (instanceResource._embedded.types.length === 1) {
                    // There was only one type, so let's get the children right away.
                    return Promise.resolve()
                        .then(() => childEntity.getDocuments(persistence))
                        .then((docs) => docs.sort(warpjsUtils.byName))
                        .then((docs) => docs.map((doc) => warpjsUtils.createResource('', {
                            type: doc.type,
                            id: doc.id,
                            name: childEntity.getDisplayName(doc)
                        })))
                        .then((docs) => instanceResource.embed('documents', docs));
                }
            })
        )
    )
;
