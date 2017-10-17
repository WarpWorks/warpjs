const Promise = require('bluebird');

const ChangeLogs = require('./../../../lib/change-logs');
const getTargetInstance = require('./get-target-instance');
const logger = require('./../../loggers');

module.exports = (req, res, persistence, entity, instance, resource) => {
    const action = ChangeLogs.constants.ASSOCIATION_ADDED;
    const relationship = req.params.relationship;
    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, req.body))
        .then(() => relationshipEntity.addAssociation(instance, req.body))
        .then(() => getTargetInstance(req, persistence, instance, relationshipEntity))
        .then((targetInstance) => ChangeLogs.addAssociation(
            req, instance, relationship,
            targetEntity.getDisplayName(targetInstance), req.body.type, req.body.id
        ))
        .then(() => entity.updateDocument(persistence, instance))
        .then(() => logger(req, `Success ${action}`))
        .then(() => res.status(204).send())
        .catch((err) => {
            const message = `Failed ${action}`;
            logger(req, message, {err});
            // console.log(message, err);
            res.status(500).send(err.message); // FIXME: Don't send the err.
        })
    ;
};
