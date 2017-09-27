const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const relationship = req.params.relationship;
    const payload = req.body;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);
    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    const resource = warpjsUtils.createResource(req, {
        title: `Child for domain ${domain} - Type ${type} - Id ${id} - Relationship ${relationship}`,
        domain,
        type,
        id,
        relationship
    });

    if (targetEntity.entityType === 'Embedded') {
        // Create a new embedded
        console.log("payload=", payload);
        Promise.resolve()
            .then(() => logger(req, "Trying to add embedded", req.body))
            .then(() => entity.getInstance(persistence, id))
            .then((instance) => entity.addEmbedded(instance, payload.docLevel, 0))
            .then((instance) => ChangeLogs.addLogFromReq(req, instance, ChangeLogs.constants.EMBEDDED_ADDED, req.body.docLevel))
            .then((instance) => entity.updateDocument(persistence, instance))
            .then(() => logger(req, ChangeLogs.constants.EMBEDDED_ADDED))
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => {
                console.log("ERROR:", err);
                logger(req, "Failed create new embedded", {err});
                res.status(500).send(err.message); // FIXME: Don't send the err.
            })
            .finally(() => persistence.close())
        ;
    } else if (payload.id && payload.type) {
        // Create a new association
        Promise.resolve()
            .then(() => logger(req, "Trying to create new association", req.body))
            .then(() => entity.getInstance(persistence, id))
            .then((instance) => relationshipEntity.addAssociation(instance, payload))
            .then((instance) => ChangeLogs.addLogFromReq(req, instance, ChangeLogs.constants.ASSOCIATION_ADDED, req.body.docLevel))
            .then((instance) => entity.updateDocument(persistence, instance))
            .then(() => logger(req, ChangeLogs.constants.ASSOCIATION_ADDED))
            .then(() => res.status(204).send())
            .catch((err) => {
                logger(req, "Failed create new association", {err});
                res.status(500).send(err.message); // FIXME: Don't send the err.
            })
            .finally(() => persistence.close())
        ;
    } else {
        // Create a new aggregation
        Promise.resolve()
            .then(() => logger(req, "Trying to create new aggregation"))
            .then(() => entity.getInstance(persistence, id))
            .then((instance) => {
                return Promise.resolve()
                    .then(() => entity.createChildForInstance(instance, relationshipEntity))
                    .then((child) => ChangeLogs.addLogFromReq(req, child, ChangeLogs.constants.ENTITY_CREATED, req.body.docLevel))
                    .then((child) => targetEntity.createDocument(persistence, child))
                    .then((newDoc) => newDoc.id)
                    .then((newId) => {
                        logger(req, ChangeLogs.constants.AGGREGATION_ADDED);

                        return Promise.resolve()
                            .then(() => ChangeLogs.addLogFromReq(req, instance, ChangeLogs.constants.AGGREGATION_ADDED, req.body.docLevel, null, newId))
                            .then((instance) => entity.updateDocument(persistence, instance))
                            .then(() => {
                                const redirectUrl = RoutesInfo.expand('W2:content:instance', {
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
                        ;
                    })
                ;
            })
            .catch((err) => {
                console.log("entity-child(): err=", err);
                resource.message = err.message;
                utils.sendHal(req, res, resource, 500);
            })
            .finally(() => persistence.close());
    }
};
