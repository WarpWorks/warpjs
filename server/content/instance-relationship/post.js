const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const logger = require('./../../loggers');
const postAggregation = require('./post-aggregation');
const postAssociation = require('./post-association');
const postEmbedded = require('./post-embedded');
const serverUtils = require('./../../utils');
const WarpWorksError = require('./../../../lib/core/error');

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
        .then(() => logger(req, "Trying to create relationship"))
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => Promise.resolve()
                .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                .then((canEdit) => {
                    if (!canEdit) {
                        throw new WarpWorksError(`You do not have permission to create this entry.`);
                    }
                })
                .then(() => (targetEntity.entityType === 'Embedded')
                    ? postEmbedded
                    : (payload.id && payload.type)
                        ? postAssociation
                        : postAggregation
                )
                .then((impl) => impl(req, res, persistence, entity, instance, resource))
            ,
            () => serverUtils.documentDoesNotExist(req, res)
        )
        .catch((err) => {
            logger(req, "Failed", {err});
            serverUtils.sendError(req, res, err);
        })
        .finally(() => persistence.close())
    ;
};
