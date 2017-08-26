/**
 *  Removes a referenced relationship. The use of PATCH is an abuse to work
 *  around some limitations on the DELETE (no payload allowed on some devices).
 */
const Promise = require('bluebird');

const logger = require('./../../loggers');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const relationship = req.params.relationship;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);
    const relationshipEntity = entity.getRelationshipByName(relationship);

    return Promise.resolve()
        .then(() => logger(req, "Trying to remove an association", req.body))
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => relationshipEntity.removeAssociation(instance, req.body))
        .then((instance) => entity.updateDocument(persistence, instance))
        .then(() => logger(req, "Association removed"))
        .then(() => res.status(204).send())
        .catch((err) => {
            logger(req, "Removing failed", {err});
            res.status(500).send(err.message); // FIXME: Do not use err
        })
        .finally(() => persistence.close())
    ;
};
