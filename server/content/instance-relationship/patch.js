/**
 *  Removes a referenced relationship. The use of PATCH is an abuse to work
 *  around some limitations on the DELETE (no payload allowed on some devices).
 */
const Promise = require('bluebird');

const removeAssociation = require('./remove-association');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => removeAssociation(req, res, persistence, entity, instance))
        .finally(() => persistence.close())
    ;
};
