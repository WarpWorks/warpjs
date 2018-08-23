const debug = require('debug')('W2:content:inline-edit/extract-data');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const extractDataParagraphs = require('./extract-data-paragraphs');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { view } = req.query;
    const { body } = req;

    debug(`domain=${domain}, type=${type}, id=${id}, view=${view}, body=`, body);

    const resource = warpjsUtils.createResource(req, {
    });

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => serverUtils.getPersistence(domain))
            .then((persistence) => Promise.resolve()
                .then(() => serverUtils.getEntity(domain, type))
                .then((entity) => Promise.resolve()
                    .then(() => entity.getInstance(persistence, id))
                    .then((instance) => Promise.resolve()
                        .then(() => warpjsUtils.createResource(req, {
                            id: instance.id,
                            type: instance.type,
                            typeID: instance.typeID,
                            name: instance.Name
                        }))
                        .then((instanceResource) => Promise.resolve()
                            .then(() => resource.embed('instances', instanceResource))

                            .then(() => {
                                if (body.elementType === 'Paragraph') {
                                    return extractDataParagraphs(req, persistence, entity, instance);
                                } else {
                                    throw new Error(`Unknown body.elementType='${body.elementType}'.`);
                                }
                            })

                            .then((items) => instanceResource.embed('items', items))
                        )
                    )
                )
                .finally(() => persistence.close())
            )
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => utils.sendErrorHal(req, res, resource, err))
    });
};
