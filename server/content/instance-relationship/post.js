const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const postAggregation = require('./post-aggregation');
const postAssociation = require('./post-association');
const postEmbedded = require('./post-embedded');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const relationship = req.params.relationship;
    const payload = req.body;

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);
    const relationshipEntity = entity.getRelationshipByName(relationship);
    const targetEntity = relationshipEntity.getTargetEntity();

    const resource = warpjsUtils.createResource(req, {
        title: `Child for domain ${domain} - Type ${type} - Id ${id} - Relationship ${relationship}`,
        domain,
        type,
        id,
        relationship
    });

    Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then((instance) => {
            const impl = (targetEntity.entityType === 'Embedded')
                ? postEmbedded
                : (payload.id && payload.type)
                    ? postAssociation
                    : postAggregation;

            return impl(req, res, persistence, entity, instance, resource);
        })
        .finally(() => persistence.close())
    ;
};
