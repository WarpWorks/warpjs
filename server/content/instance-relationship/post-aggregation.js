const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const { DEFAULT_VERSION } = require('./../../../lib/constants');
const constants = require('./../constants');
const logger = require('./../../loggers');
const utils = require('./../utils');

module.exports = async (req, res, persistence, entity, instance, resource) => {
    const { domain, relationship } = req.params;
    const { body } = req;

    const action = ChangeLogs.ACTIONS.AGGREGATION_ADDED;

    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = (body.typeId)
        ? entity.getDomain().getEntityById(body.typeId)
        : relationshipEntity.getTargetEntity()
    ;

    try {
        logger(req, `Trying ${action}`);

        const child = await targetEntity.createContentChildForRelationship(relationshipEntity, entity, instance);
        child.Version = instance.Version || DEFAULT_VERSION;

        ChangeLogs.add(ChangeLogs.ACTIONS.ENTITY_CREATED, req.warpjsUser, child, {
            label: entity.getDisplayName(instance),
            type: entity.name, // FIXME: use schemaId
            id: instance.id
        });

        const newDoc = await targetEntity.createDocument(persistence, child);

        ChangeLogs.add(action, req.warpjsUser, instance, {
            key: relationship,
            type: newDoc.type,
            id: newDoc.id
        });

        await entity.updateDocument(persistence, instance, true);

        const redirectUrl = RoutesInfo.expand(constants.routes.instance, {
            domain,
            type: targetEntity.name,
            id: newDoc.id
        });

        utils.sendRedirect(req, res, resource, redirectUrl);
    } catch (err) {
        logger(req, `Failed ${action}`, { err });
        // eslint-disable-next-line no-console
        console.error("entity-child(): err=", err);
        utils.sendErrorHal(req, res, resource, err);
    }

    return Promise.resolve()
    ;
};
