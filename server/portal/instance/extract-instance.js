// const debug = require('debug')('W2:portal:instance:extract-instance');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../config');
const Page = require('./models/page');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const { type, id } = req.params;
    const pageViewName = req.query.pageViewName || config.views.portal;

    const resource = warpjsUtils.createResource(req, {
    });

    warpjsUtils.wrapWith406(res, {
        html: () => warpjsUtils.sendIndex(res, 'Entity', 'portal'),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => serverUtils.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => serverUtils.getEntity(null, type))
                .then((entity) => Promise.resolve()
                    .then(() => entity.getInstance(persistence, id))
                    .then((instance) => Promise.resolve()
                        .then(() => new Page())
                        .then((page) => page.extract(persistence, entity, instance, pageViewName, req.warpjsUser))
                        .then((page) => resource.embed('pages', page.toHal(req)))
                    )
                )
                .finally(() => persistence.close())
            )
            .then(() => warpjsUtils.sendHal(req, res, resource, RoutesInfo))
            .catch((err) => warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo))
    });
};
