const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

// const debug = require('./debug')('get-types');

module.exports = async (req, domain, type, id) => {
    const domainInstance = await serverUtils.getDomain(domain);

    const entities = domainInstance.getEntities();
    const documentEntities = entities.filter((entity) => entity.isDocument() && !entity.isAbstract);

    return documentEntities.map((entity) => {
        const href = RoutesInfo.expand(routes.content.changeParent, {
            domain,
            type,
            id,
            entity: entity.name
        });

        const resource = warpjsUtils.createResource(
            href,
            {
                id: entity.id,
                name: entity.name,
                selected: entity.name === type
            },
            req
        );

        return resource;
    });
};
