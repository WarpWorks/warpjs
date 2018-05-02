const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const editionConstants = require('./../../edition/constants');
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
        name: entity.getDisplayName(instance),
        status: instance.Status
    });

    resource.link('portal', RoutesInfo.expand('entity', {
        type: instance.type,
        id: instance.id
    }));

    // TODO: Get the authors

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
                    `${RoutesInfo.expand('W2:app:static')}/app/${editionConstants.assets.vendor}`,
                    `${RoutesInfo.expand('W2:app:static')}/app/${editionConstants.assets.instances}`
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

            return Promise.resolve()
                .then(() => serverUtils.getPersistence(domain))
                .then((persistence) => Promise.resolve()
                    .then(() => serverUtils.getEntity(domain, type))
                    .then((entity) => Promise.resolve()
                        // FIXME: We can't use the entity ID because old data doesn't have this info.
                        .then(() => entity.getDocuments(persistence, {type: entity.name}))
                        .then((documents) => documents.map((instance) => documentMapper(entity, domain, instance)))
                        .then((embedded) => resource.embed('entities', embedded))
                        .then(() => utils.sendHal(req, res, resource))
                    )
                    .finally(() => {
                        persistence.close();
                    })
                )
            ;
        }
    });
};
