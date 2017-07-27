const Persistence = require('@warp-works/warpjs-mongo-persistence');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../config');
const extractEntity = require('./extract-entity');
const warpCore = require('./../../../lib/core');

function entity(req, res) {
    warpjsUtils.wrapWith406(res, {
        html: () => warpjsUtils.sendIndex(res, 'Entity', 'portal'),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = new Persistence(config.persistence.host, config.domainName);

            Promise.resolve()
                .then(() => warpCore.getDomainByName(config.domainName))
                .then((domain) => domain.getEntityByName(req.params.type))
                .then((hsEntity) => {
                    return hsEntity.getInstance(persistence, req.params.id)
                        .then((instance) => {
                            const isPreview = Boolean(req.query && req.query.preview === "true");
                            const responseResource = warpjsUtils.createResource(req, {
                                Name: instance.Name,
                                Desc: instance.desc,
                                Heading: instance.Heading,
                                Content: instance.Content
                            });

                            return Promise.resolve()
                                .then(extractEntity.bind(null, req, responseResource, persistence, hsEntity, instance, isPreview))
                                .then(warpjsUtils.sendHal.bind(null, req, res, responseResource, RoutesInfo, null));
                        });
                })
                .finally(() => {
                    persistence.close();
                })
                .catch((err) => {
                    let message;
                    let statusCode;

                    console.error("entity():", err);

                    if (err instanceof Persistence.PersistenceError) {
                        message = "Unable to find content.";
                        statusCode = 404;
                    } else {
                        message = "Error during processing content.";
                        statusCode = 500;
                    }

                    const resource = warpjsUtils.createResource(req, {
                        message
                    });
                    warpjsUtils.sendHal(req, res, resource, RoutesInfo, statusCode);
                });
        }
    });
}

module.exports = {
    entity
};
