/**
 *  Removes a referenced relationship. The use of PATCH is an abuse to work
 *  around some limitations on the DELETE (no payload allowed on some devices).
 */
const Promise = require('bluebird');

const logger = require('./../../loggers');
const removeAssociation = require('./remove-association');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => logger(req, "Trying remove embedded", req.body))
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => Promise.resolve()
                .then(() => entity.canBeEditedBy(persistence, instance, req.warpjsUser))
                .then((canEdit) => {
                    if (!canEdit) {
                        throw new WarpWorksError(`You do not have permission to edit this entry.`);
                    }
                })
                .then(() => removeAssociation(req, res, persistence, entity, instance))
            ,
            () => serverUtils.documentDoesNotExist(req, res)
        )
        .then(() => logger(req, "Success remove embedded"))
        .then(() => res.status(204).send())
        .catch((err) => {
            logger(req, "Failed", {err});
            serverUtils.sendError(req, res, err);
        })
        .finally(() => persistence.close())
    ;
};
