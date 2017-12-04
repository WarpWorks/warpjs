const Promise = require('bluebird');

const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => logger(req, "Trying to delete", req.body))
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => Promise.resolve()
                .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                .then((canEdit) => {
                    if (!canEdit) {
                        throw new WarpWorksError(`You do not have permission to delete this entry.`);
                    }
                })
                .then(() => entity.removeDocument(persistence, id))
                .then(() => {
                    logger(req, "Deleted", instance);
                    res.status(204).send();
                })
            ,
            () => serverUtils.documentDoesNotExist(req, res)
        )
        .catch((err) => {
            logger(req, "Failed", {err});
            serverUtils.sendError(req, res, err);
        })
        .finally(() => persistence.close());
};
