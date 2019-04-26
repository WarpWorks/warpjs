const Promise = require('bluebird');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('get');
const serverUtils = require('./../../utils');
const User = require('./../../../lib/core/first-class/user');

const config = serverUtils.getConfig();

module.exports = async (req, res) => {
    const resource = warpjsUtils.createResource(req, {
        desc: "Retrieve notifications for user"
    });

    if (req.warpjsUser) {
        const persistence = await serverUtils.getPersistence();
        try {
            const user = await User.fromJWT(persistence, config.domainName, req.warpjsUser);
            const notifications = await user.listNotifications(persistence);
            const items = await Promise.map(notifications, async (notification) => notification.toNotificationListResource(persistence));
            resource.embed('items', items);
            await warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Retrieve user's notifications: err=`, err);
            await warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
        } finally {
            persistence.close();
        }
    } else {
        const error = { message: "Not logged in." };
        await warpjsUtils.sendErrorHal(req, res, resource, error, RoutesInfo, 403);
    }
};
