/**
 *  This module allows the addition of an association on embedded entities.
 */
const Promise = require('bluebird');
// const debug = require('debug')('W2:content:instance/post');

const ChangeLogs = require('./../../../lib/change-logs');
const DocLevel = require('./../../../lib/doc-level');
const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = (req, res) => {
    const { domain, type, id } = req.params;
    const { body } = req;

    return Promise.resolve()
        .then(() => logger(req, "Trying to create embedded association"))
        .then(() => serverUtils.getPersistence(domain))
        .then((persistence) => Promise.resolve()
            .then(() => serverUtils.getEntity(domain, type))
            .then((entity) => Promise.resolve()
                .then(() => entity.getInstance(persistence, id))
                .then((instance) => Promise.resolve()
                    .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                    .then((canEdit) => {
                        if (!canEdit) {
                            throw new WarpWorksError(`You do not have permissions to create this entry.`);
                        }
                    })

                    .then(() => DocLevel.fromString(body.docLevel))
                    .then((docLevel) => docLevel.getData(persistence, entity, instance, 0))
                    .then((docLevelData) => {
                        const newData = docLevelData.model.createTargetInstance();
                        docLevelData.model.addTargetInstance(persistence, docLevelData.instance, newData.instance);
                    })

                    .then(() => ChangeLogs.addEmbedded(req, instance, body.docLevel, body.type, body.id))
                    .then(() => entity.updateDocument(persistence, instance))
                    .then(() => logger(req, `Success add embedded association`))
                    .then(() => res.status(204).send())
                )
            )
            .catch((err) => {
                console.log("ERROR:", err);
                logger(req, "Failed to create embedded association", {err});
                res.status(500).send(err.message); // FIXME: Don't send the err.
            })
            .finally(() => persistence.close())
        )
    ;
};
