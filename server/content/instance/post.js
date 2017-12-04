/**
 *  This module allows the addition of an association on embedded entities.
 */
const Promise = require('bluebird');

const ChangeLogs = require('./../../../lib/change-logs');
const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const walk = require('./../../../lib/core/doc-level/walk');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const payload = req.body;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => logger(req, "Trying to create embedded association"))
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => Promise.resolve()
            .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
            .then((canEdit) => {
                if (!canEdit) {
                    throw new WarpWorksError(`You do not have permissions to create this entry.`);
                }
            })
            .then(() => walk(payload.docLevel, entity, instance))
            .then((association) => {
                const found = association.data.filter((target) => target._id === payload.id && target.type === payload.type).pop();
                if (!found) {
                    association.data.push({
                        _id: payload.id,
                        type: payload.type,
                        desc: ''
                    });
                }
            })
            .then(() => ChangeLogs.addEmbedded(req, instance, payload.docLevel, payload.type, payload.id))
            .then(() => entity.updateDocument(persistence, instance))
            .then(() => logger(req, `Success add embedded association`))
            .then(() => res.status(204).send())
        )
        .catch((err) => {
            console.log("ERROR:", err);
            logger(req, "Failed to create embedded association", {err});
            res.status(500).send(err.message); // FIXME: Don't send the err.
        })
        .finally(() => persistence.close())
    ;
};
