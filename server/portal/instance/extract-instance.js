const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const debug = require('./debug')('extract-instance');
const extractPage = require('./extract-page');
const routes = require('./../../../lib/constants/routes');
const serverUtils = require('./../../utils');
const User = require('./../../../lib/core/first-class/user');

const config = serverUtils.getConfig();

module.exports = (req, res) => {
    const { type, id } = req.params;
    const pageViewName = req.query.pageViewName || config.views.portal;

    const resource = warpjsUtils.createResource(req, {
        customMessages: {}
    });

    if (req.warpjsUser) {
        if (req.warpjsUser.type === type && req.warpjsUser.id === id) {
            resource.myPage = true;
        }

        resource.link('follow', {
            title: "Follow this page",
            href: RoutesInfo.expand(routes.portal.follow, { type, id, yesno: 'yes' })
        });
        resource.link('unfollow', {
            title: "Unfollow this page",
            href: RoutesInfo.expand(routes.portal.follow, { type, id, yesno: 'no' })
        });
    }

    warpjsUtils.wrapWith406(res, {
        html: async () => {
            await warpjsUtils.sendPortalIndex(req, res, RoutesInfo, 'Entity', 'portal');
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: async () => {
            const persistence = await serverUtils.getPersistence();

            try {
                if (req.warpjsUser) {
                    const user = await User.fromJWT(persistence, config.domainName, req.warpjsUser);
                    if (await user.isFollowing(persistence, type, id)) {
                        debug(`isFollowing...`);
                    }
                }

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

                warpjsUtils.sendHal(req, res, resource, RoutesInfo);
            } catch (err) {
                warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
            } finally {
                persistence.close();
            }
        }
    });
};
