/**
 *  This module allows the deletion of an association on embedded entities.
 */
const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');

const DocLevel = require('./../../../lib/doc-level');
const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { body } = req;

    return Promise.resolve()
        .then(() => logger(req, "Trying to delete embedded association"))
        .then(() => serverUtils.getPersistence(domain))
        .then((persistence) => Promise.resolve()
            .then(() => serverUtils.getEntity(domain, type))
            .then((entity) => Promise.resolve()
                .then(() => entity.getInstance(persistence, id))
                .then((instance) => Promise.resolve()
                    .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                    .then((canEdit) => {
                        if (!canEdit) {
                            throw new WarpWorksError(`You do not have permissions to delete this entry.`);
                        }
                    })

                    .then(() => DocLevel.fromString(body.docLevel))
                    .then((docLevel) => Promise.resolve()
                        .then(() => docLevel.getData(persistence, entity, instance, 0))
                        .then((docLevelData) => Promise.resolve()
                            .then(() => docLevelData.model.getDocuments(persistence, docLevelData.instance))
                            .then((imageDocuments) => {
                                if (imageDocuments && imageDocuments.length > 0) {
                                    return Promise.resolve()
                                        .then((newData) => docLevelData.model.deleteAllInstances(persistence, docLevelData.instance))
                                    ;
                                }
                            })
                        )
                    )
                    .then(() => ChangeLogs.add(ChangeLogs.ACTIONS.EMBEDDED_REMOVED, req.warpjsUser, instance, {
                        key: body.docLevel,
                        type: body.type,
                        id: id
                    }))
                    .then(() => entity.updateDocument(persistence, instance, true))
                    .then(() => logger(req, `Success deleting embedded association`))
                    .then(() => res.status(204).send())
                )
            )
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error("ERROR:", err);
                logger(req, "Failed to delete embedded association", { err });
                res.status(500).send(err.message); // FIXME: Don't send the err.
            })
            .finally(() => persistence.close())
        )
    ;
};
