// const debug = require('debug')('W2:portal:instance:extract-instance');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../config');
const extractPage = require('./extract-page');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const { type, id } = req.params;
    const pageViewName = req.query.pageViewName || config.views.portal;

    const resource = warpjsUtils.createResource(req, {
    });

    warpjsUtils.wrapWith406(res, {
        html: () => warpjsUtils.sendPortalIndex(req, res, RoutesInfo, 'Entity', 'portal'),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => serverUtils.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => serverUtils.getEntity(null, type))
                .then((entity) => Promise.resolve()
                    .then(() => entity.getInstance(persistence, id))
                    .then((instance) => Promise.resolve()
                        .then(() => extractPage(req, persistence, entity, instance, pageViewName))
                        .then((pageResource) => resource.embed('pages', pageResource))
                    )
                )
                .finally(() => persistence.close())
            )
            .then(() => warpjsUtils.sendHal(req, res, resource, RoutesInfo))
            .catch((err) => warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo))
    });
};
