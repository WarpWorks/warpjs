const RoutesInfo = require('@quoin/expressjs-routes-info');
const Promise = require('bluebird');

const ChangeLogs = require('./../../../lib/change-logs');
const logger = require('./../../loggers');
const utils = require('./../utils');

module.exports = (req, res, persistence, entity, instance, resource) => {
    const domain = req.params.domain;
    const relationship = req.params.relationship;

    const action = ChangeLogs.constants.AGGREGATION_ADDED;

    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`))
        .then(() => entity.createChildForInstance(instance, relationshipEntity))
        .then((child) => Promise.resolve()
            .then(() => ChangeLogs.createEntity(req, child, entity.getDisplayName(instance), entity.schemaId, instance.id))
            .then(() => targetEntity.createDocument(persistence, child))
            .then((newDoc) => Promise.resolve()
                .then(() => ChangeLogs.addAggregation(req, instance, relationship, newDoc.type, newDoc.id))
                .then(() => entity.updateDocument(persistence, instance))
                .then(() => {
                    const redirectUrl = RoutesInfo.expand('W2:content:instance', {
                        domain,
                        type: targetEntity.name,
                        id: newDoc.id
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
        )
        .catch((err) => {
            logger(req, `Failed ${action}`, {err});
            console.log("entity-child(): err=", err);
            resource.message = err.message;
            utils.sendHal(req, res, resource, 500);
        })
    ;
};
