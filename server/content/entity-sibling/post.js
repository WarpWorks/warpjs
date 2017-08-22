const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    console.log("entity-sibling(): domain=", domain, "; type=", type, "; id=", id);

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    const resource = warpjsUtils.createResource(req, {
        title: `Sibling for domain ${domain} - Type ${type} - Id ${id}`,
        domain,
        type,
        id
    });

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => entity.createSiblingForInstance(instance))
        .then((sibling) => entity.createDocument(persistence, sibling))
        .then((newDoc) => newDoc.id)
        .then((newId) => {
            const redirectUrl = RoutesInfo.expand('W2:content:entity', {
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
        .catch((err) => {
            console.log("entity-sibling(): err=", err);
            resource.message = err.message;
            utils.sendHal(req, res, resource, 500);
        })
        .finally(() => persistence.close());
};
