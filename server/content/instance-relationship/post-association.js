const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');

const getTargetInstance = require('./get-target-instance');
const logger = require('./../../loggers');

module.exports = (req, res, persistence, entity, instance, resource) => {
    const action = ChangeLogs.ACTIONS.ASSOCIATION_ADDED;
    const relationship = req.params.relationship;
    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, req.body))
        .then(() => relationshipEntity.addAssociation(instance, req.body, persistence))
        .then(() => getTargetInstance(req, persistence, instance, relationshipEntity))
        .then((targetInstance) => ChangeLogs.add(action, req.warpjsUser, instance, {
            key: relationship,
            label: targetEntity.getDisplayName(targetInstance),
            type: req.body.type,
            id: req.body.id
        }))
        .then(() => entity.updateDocument(persistence, instance, true))
        .then(() => logger(req, `Success ${action}`))
        .then(() => res.status(204).send())
        .catch((err) => {
            const message = `Failed ${action}`;
            // eslint-disable-next-line no-console
            console.error(err);
            logger(req, message, { err });
            // console.log(message, err);
            res.status(500).send(err.message); // FIXME: Don't send the err.
        })
    ;
};
