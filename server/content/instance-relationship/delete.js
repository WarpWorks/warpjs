const Promise = require('bluebird');

const removeEmbedded = require('./remove-embedded');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const relationship = req.params.relationship;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);
    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => {
            if (targetEntity.entityType === 'Embedded') {
                return removeEmbedded(req, res, persistence, entity, instance);
            } else {
                throw new Error(`Unexpected entityType: '${targetEntity.entityType}'`);
            }
        })
        .finally(() => persistence.close())
    ;
};
