const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const constants = require('./../constants');
const logger = require('./../../loggers');
const utils = require('./../utils');

module.exports = (req, res, persistence, entity, instance, resource) => {
    const { domain, relationship } = req.params;
    const { body } = req;

    const action = ChangeLogs.ACTIONS.AGGREGATION_ADDED;

    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = (body.typeId)
        ? entity.getDomain().getEntityById(body.typeId)
        : relationshipEntity.getTargetEntity()
    ;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`))
        .then(() => targetEntity.createContentChildForRelationship(relationshipEntity, entity, instance))
        .then((child) => Promise.resolve()
            .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.ENTITY_CREATED, req.warpjsUser, child, {
                label: entity.getDisplayName(instance),
                type: entity.name, // FIXME: use schemaId
                id: instance.id
            }))
            .then(() => targetEntity.createDocument(persistence, child))
            .then((newDoc) => Promise.resolve()
                .then(() => ChangeLogs.add(action, req.warpjsUser, instance, {
                    key: relationship,
                    type: newDoc.type,
                    id: newDoc.id
                }))
                .then(() => entity.updateDocument(persistence, instance, true))
                .then(() => {
                    const redirectUrl = RoutesInfo.expand(constants.routes.instance, {
                        domain,
                        type: targetEntity.name,
                        id: newDoc.id
                    });

                    utils.sendRedirect(req, res, resource, redirectUrl);
                })
            )
        )
        .catch((err) => {
            logger(req, `Failed ${action}`, { err });
            // eslint-disable-next-line no-console
            console.error("entity-child(): err=", err);
            utils.sendErrorHal(req, res, resource, err);
        })
    ;
};
