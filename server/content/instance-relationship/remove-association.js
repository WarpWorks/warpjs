const ChangeLogs = require('@warp-works/warpjs-change-logs');

const getTargetInstance = require('./get-target-instance');
const logger = require('./../../loggers');

module.exports = async (req, res, persistence, entity, instance) => {
    const relationship = req.params.relationship;

    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    const action = ChangeLogs.ACTIONS.ASSOCIATION_REMOVED;

    logger(req, `Trying ${action}`, req.body);

    try {
        const targetInstance = await getTargetInstance(req, persistence, instance, relationshipEntity);

        ChangeLogs.add(action, req.warpjsUser, instance, {
            key: relationship,
            label: targetEntity.getDisplayName(targetInstance),
            type: req.body.type,
            id: req.body.id
        });

        await relationshipEntity.removeAssociation(instance, req.body, persistence);
        await entity.updateDocument(persistence, instance);

        logger(req, `Success ${action}`);
        res.status(204).send();
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Failed ${action}`, err);
        logger(req, `Failed ${action}`, { err });
        res.status(500).send(err.message); // FIXME: Do not use err
    }
};
