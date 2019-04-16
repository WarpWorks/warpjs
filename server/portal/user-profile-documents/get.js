const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const User = require('./../../../lib/core/first-class/user');

const config = serverUtils.getConfig();

module.exports = async (req, res) => {
    const resource = warpjsUtils.createResource(req, {
        desc: "Retrieve documents for user"
    });

    if (req.warpjsUser) {
        const persistence = await serverUtils.getPersistence();
        try {
            const user = await User.fromJWT(persistence, config.domainName, req.warpjsUser);
            const documents = await user.listDocuments(persistence);
            resource.embed('documents', documents.map((doc) => doc.toDocumentListResource()));
            await warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Retrieve user's documents: err=`, err);
            await warpjsUtils.sendErrorHal(req, res, resource, err, RoutesInfo);
        } finally {
            persistence.close();
        }
    } else {
        const error = { message: "Not logged in." };
        await warpjsUtils.sendErrorHal(req, res, resource, error, RoutesInfo, 403);
    }
};
