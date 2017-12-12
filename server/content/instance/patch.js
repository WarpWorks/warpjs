// const debug = require('debug')('W2:content:instance:patch');
const Promise = require('bluebird');

const serverUtils = require('./../../utils');
const updateValue = require('./update-value');

module.exports = (req, res, next) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => updateValue(req, res, persistence, entity, instance))
        .catch((err) => {
            console.log("Error content.instance.patch():", err);
            next(err);
        })
        .finally(() => persistence.close());
};
