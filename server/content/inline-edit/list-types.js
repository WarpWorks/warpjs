const warpjsUtils = require('@warp-works/warpjs-utils');

const EntityTypes = require('./../../../lib/core/entity-types');

module.exports = async (persistence, entity, instance, body, instanceResource) => {
    const childRelationship = entity.getRelationshipById(body.reference.id);

    const associations = await childRelationship.getDocuments(persistence, instance);
    const associationResources = associations
        .sort(warpjsUtils.byName)
        .map((association) => warpjsUtils.createResource('', {
            type: association.type,
            id: association.id,
            name: childRelationship.getDisplayName(association),
            description: association.relnDesc,
            position: association.relnPosition
        }))
    ;
    instanceResource.embed('associations', associationResources);

    const childEntity = childRelationship.getTargetEntity();
    const childEntities = [ childEntity ]
        .concat(childEntity.getChildEntities(true, true))
        .filter((childEntity) => !childEntity.isAbstract)
        .filter((childEntity) => childEntity.entityType === EntityTypes.DOCUMENT)
        .sort(warpjsUtils.byName)
        .map((childEntity) => warpjsUtils.createResource('', {
            id: childEntity.id,
            name: childEntity.label || childEntity.name
        }))
    ;
    instanceResource.embed('types', childEntities);

    if (instanceResource._embedded.types.length === 1) {
        // There was only one type, so let's get the children right away.
        const docs = await childEntity.getDocuments(persistence);
        const docResources = docs
            .sort(warpjsUtils.byName)
            .map((doc) => warpjsUtils.createResource('', {
                type: doc.type,
                id: doc.id,
                name: childEntity.getDisplayName(doc)
            }))
        ;
        instanceResource.embed('documents', docResources);
    }
};
