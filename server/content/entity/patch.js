const debug = require('debug')('W2:content:entity:patch');
const Promise = require('bluebird');

const logger = require('./../../loggers').bind(null, 'W2:content:entity:patch', 'info');
const serverUtils = require('./../../utils');

function updateDocument(persistence, entity, instance, req, res) {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const payload = req.body;

    debug('payload=', payload);

    return Promise.resolve()
        .then(() => entity.patch(payload.updatePath, 0, instance, payload.updateValue))
        .then((oldValue) => logger(req, `Updating ${domain}/${type}/${id}`, {
            updatePath: payload.updatePath,
            newValue: payload.updateValue,
            oldValue
        }))
        .then(() => entity.updateDocument(persistence, instance))
        .then(() => res.status(204).send())
        .catch((err) => res.status(500).send(err.message))
        .finally(() => persistence.close());
}

function documentDoesNotExist(error, req, res) {
    console.log("error=", error);
    res.status(404).send();
}

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    console.log("TODO: apply action");

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => updateDocument(persistence, entity, instance, req, res),
            (err) => documentDoesNotExist(err, req, res)
        )
        .catch((err) => {
            console.log(`PATCH ${req.originalUrl}: ERROR=`, err);
            throw err;
        })
    ;
};
