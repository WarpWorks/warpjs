// const debug = require('debug')('W2:content:instances/get');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { DEFAULT_VERSION } = require('./../../../lib/constants');
const constants = require('./../constants');
const editionConstants = require('./../../edition/constants');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

function documentMapper(persistence, entity, domain, instance) {
    return Promise.resolve()
        .then(() => RoutesInfo.expand(constants.routes.instance, {
            domain,
            type: instance.type,
            id: instance.id
        }))
        .then((documentUrl) => warpjsUtils.createResource(documentUrl, {
            isRootInstance: instance.isRootInstance || undefined,
            id: instance.id,
            type: instance.type,
            name: entity.getDisplayName(instance),
            description: instance.Description,
            status: instance.Status,
            version: instance.Version || DEFAULT_VERSION
        }))
        .then((resource) => Promise.resolve()
            .then(() => resource.link('portal', RoutesInfo.expand('entity', {
                type: instance.type,
                id: instance.id
            })))

            // FIXME: What is this for?
            .then(() => entity.getRelationshipByName('Authors')) // FIXME hard-coded
            .then((relationship) => relationship
                ? relationship.getDocuments(persistence, instance)
                : []
            )
            .then((authors) => authors.map((author) => ({ Name: author.Name })))
            .then((authors) => {
                if (authors && authors.length) {
                    resource.embed('authors', authors);
                }
            })
            .then(() => resource)
        )
    ;
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
                href: RoutesInfo.expand(constants.routes.entities, {
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
                        .then(() => entity.getDocuments(persistence, { type: entity.name }))
                        .then((documents) => documents.sort(warpjsUtils.byName))
                        .then((documents) => documents.filter((d) => d.Name !== 'TEMPLATE'))
                        .then((documents) => Promise.map(
                            documents,
                            (instance) => documentMapper(persistence, entity, domain, instance)
                        ))
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
