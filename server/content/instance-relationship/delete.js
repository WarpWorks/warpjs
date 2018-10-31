const Promise = require('bluebird');

const EntityTypes = require('./../../../lib/core/entity-types');
const logger = require('./../../loggers');
const removeEmbedded = require('./remove-embedded');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

const { actions } = require('./../../../lib/constants');

const ACTION = actions.REMOVE_CHILD;

module.exports = (req, res) => {
    const { domain, type, id, relationship } = req.params;
    const { body } = req;

    const persistence = serverUtils.getPersistence(domain);

    Promise.resolve()
        .then(() => logger(req, `Trying ${ACTION}`, body))
        .then(() => serverUtils.getEntity(domain, type))
        .then((entity) => Promise.resolve()
            .then(() => entity.getRelationshipByName(relationship))
            .then((relationshipEntity) => relationshipEntity.getTargetEntity())
            .then((targetEntity) => Promise.resolve()
                .then(() => entity.getInstance(persistence, id))
                .then((instance) => Promise.resolve()
                    .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                    .then((canEdit) => {
                        if (!canEdit) {
                            throw new WarpWorksError(`You do not have permission to remove this entry.`);
                        }
                    })
                    .then(() => {
                        if (targetEntity.entityType === EntityTypes.EMBEDDED) {
                            return removeEmbedded(req, res, persistence, entity, instance);
                        } else {
                            throw new Error(`Unexpected entityType: '${targetEntity.entityType}'`);
                        }
                    })
                )
                .then(() => logger(req, `Success ${ACTION}`))
                .then(() => res.status(204).send())
            )
        )
        .catch((err) => {
            logger(req, `Failed ${ACTION}`, {err});
            serverUtils.sendError(req, res, err);
        })
        .finally(() => persistence.close())
    ;
};
