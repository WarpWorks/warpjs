const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    // Verify header HTTP_X_REQUESTED_WITH or 'x-requested-with'

    return Promise.resolve()
        .then(() => entity.createDocument(persistence, {}))
        .then((newDoc) => newDoc.insertedId)
        .then((id) => {
            const redirectUrl = RoutesInfo.expand('W2:content:entity', {
                domain,
                type,
                id
            });

            if (req.headers['x-requested-with']) {
                // Was ajax call. return a resource.
                const resource = warpjsUtils.createResource(req, {
                    domain,
                    type
                });

                resource.link('redirect', redirectUrl);

                utils.sendHal(req, res, resource);
            } else {
                // Direct call.
                res.redirect(redirectUrl);
            }
        })
        .finally(() => persistence.close());
};
