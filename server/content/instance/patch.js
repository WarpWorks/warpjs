const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const logger = require('./../../loggers');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

function updateDocument(persistence, entity, instance, req, res) {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const payload = req.body;

    return Promise.resolve()
        .then(() => entity.patch(payload.updatePath, 0, instance, payload.updateValue))
        .then((oldValue) => {
            logger(req, `${domain}/${type}/${id}`, {
                updatePath: payload.updatePath,
                newValue: payload.updateValue,
                oldValue
            });
            ChangeLogs.addLogFromReq(req, instance, ChangeLogs.constants.UPDATE_VALUE, payload.updatePath, oldValue, payload.updateValue);
        })
        .then(() => entity.updateDocument(persistence, instance))
        .then(() => res.status(204).send());
}

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    // FIXME: What happens for a password? The password should not be managed
    // with the "content" side of things, and should not, be using this
    // end-point.
    logger(req, "Trying to patch", req.body);

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => updateDocument(persistence, entity, instance, req, res),
            () => serverUtils.documentDoesNotExist(req, res)
        )
        .catch((err) => {
            logger(req, "Failed patch", {err});
            const resource = warpjsUtils.createResource(req, {
                domain,
                type,
                id,
                body: req.body,
                message: err.message
            });
            utils.sendHal(req, res, resource, 500);
        })
        .finally(() => persistence.close());
};
