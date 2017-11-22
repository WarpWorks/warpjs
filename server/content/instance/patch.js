const Promise = require('bluebird');

const serverUtils = require('./../../utils');
const updateValue = require('./update-value');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => updateValue(req, res, persistence, entity, instance))
        .finally(() => persistence.close());
};
