const ChangeLogs = require('@warp-works/warpjs-change-logs');
const Promise = require('bluebird');

const logger = require('./../../loggers');
const utils = require('./../utils');

module.exports = (req, res, persistence, entity, instance, resource) => {
    const action = ChangeLogs.ACTIONS.EMBEDDED_ADDED;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, req.body))
        .then(() => entity.addEmbedded(instance, req.body.docLevel, 0))
        .then((newInstance) => ChangeLogs.add(action, req.warpjsUser, instance, {
            key: req.body.docLevel,
            type: newInstance.type,
            id: newInstance._id
        }))
        .then(() => entity.updateDocument(persistence, instance))
        .then(() => logger(req, `Success ${action}`))
        .then(() => utils.sendHal(req, res, resource))
        .catch((err) => {
            // eslint-disable-next-line no-console
            console.error("ERROR:", err);
            logger(req, "Failed create new embedded", { err });
            res.status(500).send(err.message); // FIXME: Don't send the err.
        })
    ;
};
