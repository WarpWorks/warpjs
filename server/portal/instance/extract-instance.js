// import ReactDOMServer from 'react-dom/server';

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const debug = require('../debug')('instance/extract-instance');
const extractPage = require('./extract-page');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = (req, res) => {
    const { type, id } = req.params;
    const pageViewName = req.query.pageViewName || config.views.portal;

    warpjsUtils.wrapWith406(res, {
        html: async () => {
            const resource = warpjsUtils.createResource(req, {});

            const persistence = serverUtils.getPersistence();

            try {
                const entity = await serverUtils.getEntity(null, type);
                const w2cookies = (req.signedCookies && req.signedCookies.w2cookies) ? JSON.parse(req.signedCookies.w2cookies) : {};

                resource.customMessages = await warpjsUtils.server.getCustomMessagesByPrefix(persistence, config, entity.getDomain(), 'Portal');

                if (!w2cookies.accepted) {
                    resource.link('acceptCookies', {
                        href: RoutesInfo.expand(routes.portal.acceptCookies, {}),
                        title: "Accept Cookies"
                    });
                }

                const instance = await entity.getInstance(persistence, id);

                if (!instance.id) {
                    throw new warpjsUtils.WarpJSError(`Invalid document '${type}' with id='${id}'.`);
                }

                const pageResource = await extractPage(req, persistence, entity, instance, pageViewName);
                resource.embed('pages', pageResource);

                const state = warpjsUtils.flattenHAL(resource.toJSON());
                debug('state=', state);

                res.status(200).send("Hello");

                // warpjsUtils.sendPortalIndex(req, res, RoutesInfo, 'Entity', 'portal');
            } catch (err) {
                console.error("Error: err=", err);
            } finally {
                persistence.close();
            }
        }

        //             .then(() => warpjsUtils.sendHal(req, res, resource, RoutesInfo))
        //             .catch((err) => warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo))
    });
};
