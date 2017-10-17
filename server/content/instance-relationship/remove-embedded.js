const Promise = require('bluebird');

const ChangeLogs = require('./../../../lib/change-logs');
const logger = require('./../../loggers');

module.exports = (req, res, persistence, entity, instance) => {
    const action = ChangeLogs.constants.EMBEDDED_REMOVED;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, req.body))
        .then(() => entity.removeEmbedded(instance, req.body.docLevel, 0))
        .then(() => ChangeLogs.removeEmbedded(req, instance, req.body.docLevel))
        .then(() => entity.updateDocument(persistence, instance))
        .then(() => logger(req, `Success ${action}`))
        .then(() => res.status(204).send())
        .catch((err) => {
            console.log("ERROR:", err);
            logger(req, `Failed ${action}`, {err});
            res.status(500).send(err.message); // FIXME: Don't send the err.
        })
    ;
};
