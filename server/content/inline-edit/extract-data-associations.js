// const debug = require('debug')('W2:content:inline-edit/extract-data-associations');
// const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');

const docResource = (doc) => warpjsUtils.createResource('', {
    type: doc.type,
    id: doc.id,
    relnPosition: doc.relnPosition,
    relnDescription: doc.relnDesc,
    name: doc.Name
});

module.exports = async (persistence, relationship, instance) => {
    const href = RoutesInfo.expand(routes.inlineEditRelationship, {
        domain: relationship.getDomain().name,
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

    const documents = await relationship.getDocuments(persistence, instance);

    resource.embed('items', documents.map(docResource));

    return resource;
};
