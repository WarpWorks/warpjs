const Promise = require('bluebird');

const ChangeLogs = require('./../../../lib/change-logs');
const getTargetInstance = require('./get-target-instance');
const logger = require('./../../loggers');

module.exports = (req, res, persistence, entity, instance) => {
    const relationship = req.params.relationship;

    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    const action = ChangeLogs.constants.ASSOCIATION_REMOVED;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, req.body))
        .then(() => getTargetInstance(req, persistence, instance, relationshipEntity))
        .then((targetInstance) => ChangeLogs.removeAssociation(
            req, instance, relationship,
            targetEntity.getDisplayName(targetInstance), req.body.type, req.body.id
        ))
        .then((instance) => relationshipEntity.removeAssociation(instance, req.body))
        .then((instance) => entity.updateDocument(persistence, instance))
        .then(() => logger(req, `Success ${action}`))
        .then(() => res.status(204).send())
        .catch((err) => {
            console.log(`Failed ${action}`, err);
            logger(req, `Failed ${action}`, {err});
            res.status(500).send(err.message); // FIXME: Do not use err
        });
};
