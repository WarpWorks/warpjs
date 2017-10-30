const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const logger = require('./../../loggers');
const utils = require('./../utils');

module.exports = (req, res, persistence, entity, instance) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const payload = req.body;

    const action = ChangeLogs.constants.UPDATE_VALUE;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, req.body))
        .then(() => entity.patch(payload.updatePath, 0, instance, payload.updateValue))
        .then((valueInfo) => {
            logger(req, `Success ${action}`, {
                updatePath: payload.updatePath,
                newValue: valueInfo.newValue,
                oldValue: valueInfo.oldValue
            });
            ChangeLogs.updateValue(req, instance, payload.updatePath, valueInfo.oldValue, valueInfo.newValue);
        })
        .then(() => entity.updateDocument(persistence, instance))
        .then(() => res.status(204).send())
        .catch((err) => {
            logger(req, `Failed ${action}`, {err});
            const resource = warpjsUtils.createResource(req, {
                domain,
                type,
                id,
                body: req.body,
                message: err.message
            });
            utils.sendHal(req, res, resource, 500);
        })
    ;
};
