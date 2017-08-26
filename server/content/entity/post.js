/**
 *  Module to create a child relationship item.
 */
const Promise = require('bluebird');

const logger = require('./../../loggers');
const serverUtils = require('./../../utils');

function updateDocument(persistence, entity, instance, req) {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const payload = req.body;

    return Promise.resolve()
        .then(() => console.log("Instance before:", instance))
        .then(() => entity.addData(payload.updatePath, 0, instance, payload.updateValue))
        .then(() => console.log("Instance after:", instance))
        .then(() => logger(req, `${domain}/${type}/${id}`, {
            updatePath: payload.updatePath,
            newValue: payload.updateValue
        }))
        .then(() => entity.updateDocument(persistence, instance))
    ;
}

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => updateDocument(persistence, entity, instance, req))
        .then(() => res.status(204).send())
        .catch((err) => {
            logger(req, "Failed post", {err});
            res.status(500).send(err.message); // FIXME: Don't send the err.
        })
        .finally(() => persistence.close())
    ;
};
