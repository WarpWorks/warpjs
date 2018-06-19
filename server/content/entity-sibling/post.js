const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    const resource = warpjsUtils.createResource(req, {
        title: `Sibling for domain ${domain} - Type ${type} - Id ${id}`,
        domain,
        type,
        id
    });

    return Promise.resolve()
        .then(() => serverUtils.getEntity(domain, type))
        .then((entity) => Promise.resolve()
            .then(() => entity.getInstance(persistence, id))
            .then((instance) => entity.createSiblingForInstance(instance))
            .then((sibling) => entity.createDocument(persistence, sibling))
            .then((newDoc) => newDoc.id)
            .then((newId) => {
                const redirectUrl = RoutesInfo.expand(constants.routes.instance, {
                    domain,
                    type,
                    id: newId
                });

                if (req.headers['x-requested-with']) {
                    // Was ajax call. return a resource.
                    resource.link('redirect', redirectUrl);

                    utils.sendHal(req, res, resource);
                } else {
                    // Direct call.
                    res.redirect(redirectUrl);
                }
            })
        )
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error("entity-sibling(): err=", err);
            resource.message = err.message;
            utils.sendHal(req, res, resource, 500);
        })
        .finally(() => persistence.close());
};
