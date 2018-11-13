// const debug = require('debug')('W2:content:inline-edit/extract-data-associations');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const EntityTypes = require('./../../../lib/core/entity-types');
const { routes } = require('./../constants');

module.exports = async (persistence, relationship, instance) => {
    const domain = relationship.getDomain().name;
    const targetEntity = relationship.getTargetEntity();

    const href = RoutesInfo.expand(routes.inlineEditRelationship, {
        domain,
        type: instance.type,
        id: instance.id,
        name: relationship.name
    });

    const resource = warpjsUtils.createResource(href, {
        type: relationship.type,
        id: relationship.id,
        name: relationship.name,
        label: relationship.label || relationship.name,
        description: relationship.desc
    });

    resource.link('reorder', {
        title: "Reorder associations",
        href: RoutesInfo.expand(routes.inlineEditAssociationReorder, {
            domain,
            type: instance.type,
            id: instance.id,
            name: relationship.name
        })
    });

    resource.link('types', {
        title: "Target types",
        href: RoutesInfo.expand(routes.entity, {
            domain,
            type: targetEntity.name,
            profile: 'withChildren' // FIXME: Define a constant.
        })
    });

    resource.link('items', {
        title: `Relationship ${relationship.name}`,
        href: RoutesInfo.expand(routes.instanceRelationshipItems, {
            domain,
            type: instance.type,
            id: instance.id,
            relationship: relationship.name
        })
    });

    const documents = await relationship.getDocuments(persistence, instance);

    resource.embed('items', documents.map((doc) => {
        const href = RoutesInfo.expand(routes.instanceRelationshipItem, {
            domain,
            type: instance.type,
            id: instance.id,
            relationship: relationship.name,
            itemId: doc._id || doc.id
        });

        return warpjsUtils.createResource(href, {
            type: doc.type,
            id: doc.id,
            relnPosition: doc.relnPosition,
            relnDescription: doc.relnDesc,
            name: doc.Name
        });
    }));

    const targetEntities = targetEntity.getChildEntities(true, true)
        .concat(targetEntity)
        .filter((anEntity) => !anEntity.isAbstract)
        .filter((anEntity) => anEntity.entityType === EntityTypes.DOCUMENT)
        .sort(warpjsUtils.byName)
    ;

    const targetEntityResources = targetEntities.map((anEntity) => anEntity.toResource());
    resource.embed('targets', targetEntityResources);

    const firstTargetEntity = targetEntities.length ? targetEntities[0] : null;
    if (firstTargetEntity) {
        const documents = await firstTargetEntity.getDocuments(persistence);
        const targetInstances = documents.sort(warpjsUtils.byName);
        targetEntityResources[0].selected = true;
        targetEntityResources[0].embed('entities', targetInstances.map((targetInstance) => warpjsUtils.createResource('', {
            type: targetInstance.type,
            id: targetInstance.id,
            name: targetInstance.Name,
            description: targetInstance.Description
        })));
    }

    return resource;
};
