const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const relationship = req.params.relationship;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);
    const relationshipEntity = entity.getRelationships()
        .filter((relationshipEntity) => relationshipEntity.name === relationship)[0];
    const targetEntity = relationshipEntity.getTargetEntity();

    const resource = warpjsUtils.createResource(req, {
        title: `Child for domain ${domain} - Type ${type} - Id ${id}`,
        domain,
        type,
        id
    });

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => entity.createChildForInstance(instance, relationshipEntity))
        .then((child) => targetEntity.createDocument(persistence, child))
        .then((newDoc) => newDoc.id)
        .then((newId) => {
            const redirectUrl = RoutesInfo.expand('W2:content:entity', {
                domain,
                type: targetEntity.name,
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
            console.log("entity-child(): err=", err);
            resource.message = err.message;
            utils.sendHal(req, res, resource, 500);
        })
        .finally(() => persistence.close());
};
