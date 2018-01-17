const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

function documentMapper(entity, domain, instance) {
    const documentUrl = RoutesInfo.expand(constants.routes.instance, {
        domain,
        type: instance.type,
        id: instance.id
    });

    const resource = warpjsUtils.createResource(documentUrl, {
        isRootInstance: instance.isRootInstance || undefined,
        id: instance.id,
        type: instance.type,
        name: entity.getDisplayName(instance)
    });

    resource.link('portal', RoutesInfo.expand('entity', {
        type: instance.type,
        id: instance.id
    }));

    return resource;
}

module.exports = (req, res) => {
    const { domain, type } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Type ${type} - Entities`
    });
    res.format({
        html() {
            utils.basicRender(
                [
                    `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                    `${RoutesInfo.expand('W2:app:static')}/app/instances.js`
                ],
                resource,
                req,
                res
            );
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            resource.link('domain', {
                title: domain,
                href: RoutesInfo.expand(constants.routes.domain, {
                    domain
                })
            });

            resource.link('type', {
                title: type,
                href: RoutesInfo.expand(constants.routes.instances, {
                    domain,
                    type
                })
            });

            const persistence = serverUtils.getPersistence(domain);

            return Promise.resolve()
                .then(() => serverUtils.getEntity(domain, type))
                .then((entity) => Promise.resolve()
                    .then(() => entity.getDocuments(persistence))
                    .then((documents) => {
                        const embedded = documents.map((instance) => documentMapper(entity, domain, instance));
                        resource.embed('entities', embedded);
                    })
                    .then(() => utils.sendHal(req, res, resource))
                )
                .finally(() => {
                    persistence.close();
                })
            ;
        }
    });
};
