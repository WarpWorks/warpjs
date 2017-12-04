const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const logger = require('./../../loggers');
const search = require('./../../../lib/search');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res, persistence, entity, instance) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const payload = req.body;

    const action = ChangeLogs.constants.UPDATE_VALUE;

    return Promise.resolve()
        .then(() => logger(req, `Trying ${action}`, req.body))
        .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
        .then((canEdit) => {
            if (!canEdit) {
                throw new warpjsUtils.WarpJSError(`Do not have write permission`);
            }
        })
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
        .then(() => search.indexDocument(persistence, entity, instance))
        .then(() => res.status(204).send())
        .catch((err) => {
            console.log("updateValue(): ERROR: err=", err);
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
