const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const extractEntity = require('./extract-entity');
const extractPreviews = require('./extract-previews');
const serverUtils = require('./../../../utils');

module.exports = (req, res) => {
    warpjsUtils.wrapWith406(res, {
        html: () => warpjsUtils.sendIndex(res, 'Entity', 'portal'),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence();

            Promise.resolve()
                .then(() => serverUtils.getEntity(null, req.params.type))
                .then((entity) => Promise.resolve()
                    .then(() => entity.getInstance(persistence, req.params.id))
                    .then((instance) => {
                        const responseResource = warpjsUtils.createResource(req, {
                            Name: instance.Name,
                            Desc: instance.desc,
                            Heading: instance.Heading,
                            Content: instance.Content
                        });

                        return Promise.resolve()
                            .then(() => extractEntity(req, responseResource, persistence, entity, instance))

                            .then(() => extractPreviews(persistence, entity, instance))
                            .then((previews) => responseResource.embed('previews', previews))

                            .then(() => warpjsUtils.sendHal(req, res, responseResource, RoutesInfo));
                    })
                )
                .catch((err) => serverUtils.sendError(req, res, err))
                .finally(() => persistence.close())
            ;
        }
    });
};
