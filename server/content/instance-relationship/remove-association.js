const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');

const getTargetInstance = require('./get-target-instance');
const logger = require('./../../loggers');

module.exports = (req, res, persistence, entity, instance) => {
    const relationship = req.params.relationship;

    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    const action = ChangeLogs.ACTIONS.ASSOCIATION_REMOVED;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, req.body))
        .then(() => getTargetInstance(req, persistence, instance, relationshipEntity))
        .then((targetInstance) => ChangeLogs.add(action, req.warpjsUser, instance, {
            key: relationship,
            label: targetEntity.getDisplayName(targetInstance),
            type: req.body.type,
            id: req.body.id
        }))
        .then((instance) => relationshipEntity.removeAssociation(instance, req.body))
        .then((instance) => entity.updateDocument(persistence, instance))
        .then(() => logger(req, `Success ${action}`))
        .then(() => res.status(204).send())
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error(`Failed ${action}`, err);
            logger(req, `Failed ${action}`, { err });
            res.status(500).send(err.message); // FIXME: Do not use err
        });
};
