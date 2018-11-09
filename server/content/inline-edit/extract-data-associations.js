// const debug = require('debug')('W2:content:inline-edit/extract-data-associations');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');

module.exports = async (persistence, relationship, instance) => {
    const domain = relationship.getDomain().name;

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

    return resource;
};
