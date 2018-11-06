// const debug = require('debug')('W2:content:inline-edit/extract-data-associations');
// const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { routes } = require('./../constants');

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
        name: relationship.label || relationship.name,
        description: relationship.desc,
        reference: {
            type: relationship.type,
            id: relationship.id,
            name: relationship.name
        }
    });

    return resource;
};
