const Promise = require('bluebird');

const logger = require('./../../loggers');
const removeEmbedded = require('./remove-embedded');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const relationship = req.params.relationship;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);
    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    Promise.resolve()
        .then(() => logger(req, "Trying remove child", req.body))
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => Promise.resolve()
            .then(() => entity.canBeEditedBy(persistence, instance, req.warpjsUser))
            .then((canEdit) => {
                if (!canEdit) {
                    throw new WarpWorksError(`You do not have permission to renove this entry.`);
                }
            })
            .then(() => {
                if (targetEntity.entityType === 'Embedded') {
                    return removeEmbedded(req, res, persistence, entity, instance);
                } else {
                    throw new Error(`Unexpected entityType: '${targetEntity.entityType}'`);
                }
            })
        )
        .then(() => logger(req, "Success remove child"))
        .then(() => res.status(204).send())
        .catch((err) => {
            logger(req, "Failed", {err});
            serverUtils.sendError(req, res, err);
        })
        .finally(() => persistence.close())
    ;
};
