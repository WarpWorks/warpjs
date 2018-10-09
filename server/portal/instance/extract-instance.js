// const debug = require('debug')('W2:portal:instance:extract-instance');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const extractPage = require('./extract-page');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = (req, res) => {
    const { type, id } = req.params;
    const pageViewName = req.query.pageViewName || config.views.portal;

    const resource = warpjsUtils.createResource(req, {
        customMessages: {}
    });

    warpjsUtils.wrapWith406(res, {
        html: () => warpjsUtils.sendPortalIndex(req, res, RoutesInfo, 'Entity', 'portal'),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => serverUtils.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => serverUtils.getEntity(null, type))
                .then((entity) => Promise.resolve()
                    .then(async () => {
                        const w2cookies = (req.signedCookies && req.signedCookies.w2cookies) ? JSON.parse(req.signedCookies.w2cookies) : {};

                        resource.customMessages = await warpjsUtils.server.getCustomMessagesByPrefix(persistence, config, entity.getDomain(), 'Portal');

                        if (!w2cookies.accepted) {
                            resource.link('acceptCookies', {
                                href: RoutesInfo.expand(routes.portal.acceptCookies, {}),
                                title: "Accept Cookies"
                            });
                        }
                    })

                    .then(() => entity.getInstance(persistence, id))
                    .then((instance) => Promise.resolve()
                        .then(() => {
                            if (!instance.id) {
                                throw new warpjsUtils.WarpJSError(`Invalid document '${type}' with id='${id}'.`);
                            }
                        })
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
