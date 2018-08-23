const debug = require('debug')('W2:content:inline-edit/extract-data');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const overview = require('./resources/overview');
const pageViewResource = require('./resources/page-view');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { view } = req.query;
    const { body } = req;

    debug(`domain=${domain}, type=${type}, id=${id}, view=${view}, body=`, body);

    const config = serverUtils.getConfig();
    const pageViewName = view || config.views.portal;

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

                            .then(() => [])
                            .then((resultItems) => Promise.resolve()
                                // Overview
                                .then(() => overview(persistence, entity.getRelationshipByName('Overview'), instance))
                                .then((items) => resultItems.concat(items))
                            )

                            .then((resultItems) => Promise.resolve()
                                .then(() => entity.getPageView(pageViewName))
                                .then((pageView) => pageViewResource(persistence, pageView, instance))
                                .then((items) => resultItems.concat(items))
                            )

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
