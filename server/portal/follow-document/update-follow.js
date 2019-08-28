const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const User = require('./../../../lib/core/first-class/user');

// const debug = require('./debug')('update-follow');

const config = serverUtils.getConfig();

module.exports = async (req, res) => {
    const { type, id, yesno } = req.params;

    // debug(`type=${type}, id=${id}, yesno=${yesno}`);

    const resource = warpjsUtils.createResource(req, {
        type,
        id,
        yesno,
        desc: "Updating follow document status."
    });

    if (req.warpjsUser) {
        const persistence = await serverUtils.getPersistence();
        try {
            const user = await User.fromJWT(persistence, config.domainName, req.warpjsUser);
            await user.follows(persistence, type, id, yesno === 'yes');

            res.status(204).send();
        } catch (err) {
            await warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
        } finally {
            persistence.close();
        }
    } else {
        const error = { message: "Not logged in." };
        await warpjsUtils.sendErrorHal(req, res, resource, error, RoutesInfo, 403);
    }
};
