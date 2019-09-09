const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const routes = require('./../../../lib/constants/routes');

// const debug = require('./debug')('get-types');

module.exports = async (req, persistence, document, parentData) => {
    const domainInstance = parentData.entity.getDomain();

    const entities = domainInstance.getEntities();
    const documentEntities = entities.filter((entity) => entity.isDocument() && !entity.isAbstract && entity.isContent());

    return documentEntities.map((entity) => warpjsUtils.createResource(
        RoutesInfo.expand(routes.content.changeParent, {
            domain: domainInstance.name,
            type: document.type,
            id: document.id,
            entity: entity.name
        }),
        {
            id: entity.id,
            name: entity.name,
            selected: entity.id === parentData.entity.id
        },
        req
    ));
};
