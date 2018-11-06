const debug = require('debug')('W2:content:inline-edit/extract-data-relationship');

const EntityTypes = require('./../../../lib/core/entity-types');
const extractDataAssociations = require('./extract-data-associations');

module.exports = async (persistence, entity, instance, body) => {
    debug(`extractDataRelationship(): body=`, body);

    const relationship = entity.getRelationshipByName(body.elementId);
    if (relationship) {
        if (!relationship.isAggregation && relationship.getTargetEntity().entityType === EntityTypes.DOCUMENT) {
            const dataAssociations = await extractDataAssociations(persistence, relationship, instance);
            return dataAssociations;
        } else {
            debug(`TODO: relationship=`, relationship);
            return [];
        }
    } else {
        throw new Error(`Invalid relationship name:${body.elementId}.`);
    }
};
