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
    const { domain, type, id } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    return Promise.resolve()
        .then(() => serverUtils.getEntity(domain, type))
        .then((entity) => Promise.resolve()
            .then(() => entity.getInstance(persistence, id))
            .then(
                (instance) => Promise.resolve()
                    .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                    .then((canEdit) => {
                        if (!canEdit) {
                            throw new WarpWorksError(`You do not have permission to edit this entry.`);
                        }
                    })
                    .then(() => removeAssociation(req, res, persistence, entity, instance))
                ,
                () => serverUtils.documentDoesNotExist(req, res)
            )
        )
        .catch((err) => {
            logger(req, "Failed", {err});
            serverUtils.sendError(req, res, err);
        })
        .finally(() => persistence.close())
    ;
};
