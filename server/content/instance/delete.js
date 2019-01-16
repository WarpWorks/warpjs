const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');

const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    return Promise.resolve()
        .then(() => logger(req, "Trying to delete", req.body))
        .then(() => serverUtils.getEntity(domain, type))
        .then((entity) => Promise.resolve()
            .then(() => entity.getInstance(persistence, id))
            .then(
                (instance) => Promise.resolve()
                    .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                    .then((canEdit) => {
                        if (!canEdit) {
                            throw new WarpWorksError(`You do not have permission to delete this entry.`);
                        }
                    })

                    // Add log to parent document
                    .then(() => Promise.resolve()
                        .then(() => entity.getParentData(persistence, instance))
                        .then((parentData) => {
                            if (parentData) {
                                return Promise.resolve()
                                    .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.AGGREGATION_REMOVED, req.warpjsUser, parentData.instance, {
                                        key: instance.parentRelnName,
                                        label: entity.getDisplayName(instance),
                                        type: instance.type,
                                        id: instance.id
                                    }))
                                    .then(() => parentData.entity.updateDocument(persistence, parentData.instance))
                                ;
                            }
                        })
                    )

                    .then(() => entity.removeDocument(persistence, id))
                    .then(() => {
                        logger(req, "Deleted", instance);
                        res.status(204).send();
                    })
                ,
                () => serverUtils.documentDoesNotExist(req, res)
            )
        )
        .catch((err) => {
            logger(req, "Failed", { err });
            serverUtils.sendError(req, res, err);
        })
        .finally(() => persistence.close());
};
