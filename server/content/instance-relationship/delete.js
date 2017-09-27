const Promise = require('bluebird');

const ChangeLogs = require('./../../../lib/change-logs');
const logger = require('./../../loggers');
const serverUtils = require('./../../utils');

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

    if (targetEntity.entityType === 'Embedded') {
        Promise.resolve()
            .then(() => logger(req, "Trying to remove embedded", req.body))
            .then(() => entity.getInstance(persistence, id))
            .then((instance) => entity.removeEmbedded(instance, payload.docLevel, 0))
            .then((instance) => ChangeLogs.addLogFromReq(req, instance, ChangeLogs.constants.EMBEDDED_REMOVED, req.body.docLevel))
            .then((instance) => entity.updateDocument(persistence, instance))
            .then(() => logger(req, ChangeLogs.constants.EMBEDDED_REMOVED))
            .then(() => res.status(204).send())
            .catch((err) => {
                console.log("ERROR:", err);
                logger(req, "Failed create new embedded", {err});
                res.status(500).send(err.message); // FIXME: Don't send the err.
            })
            .finally(() => persistence.close())
        ;
    } else {
        throw new Error(`Unexpected entityType: '${targetEntity.entityType}'`);
    }
};
