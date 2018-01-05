// const debug = require('debug')('W2:content:instance:patch');
const Promise = require('bluebird');

const serverUtils = require('./../../utils');
const updateValue = require('./update-value');

module.exports = (req, res, next) => {
    const { domain, type, id } = req.params;

    const persistence = serverUtils.getPersistence(domain);

    return Promise.resolve()
        .then(() => serverUtils.getEntity(domain, type))
        .then((entity) => Promise.resolve()
            .then(() => entity.getInstance(persistence, id))
            .then((instance) => updateValue(req, res, persistence, entity, instance))
        )
        .catch((err) => {
            console.log("Error content.instance.patch():", err);
            next(err);
        })
        .finally(() => persistence.close());
};
