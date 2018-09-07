const debug = require('debug')('W2:content:inline-edit/extract-data-relationship');
const Promise = require('bluebird');

const EntityTypes = require('./../../../lib/core/entity-types');
const extractDataAssociations = require('./extract-data-associations');

module.exports = (persistence, entity, instance, body) => Promise.resolve()
    .then(() => entity.getRelationshipById(body.elementId))
    .then((relationship) => relationship
        ? Promise.resolve()
            .then(() => !relationship.isAggregation && relationship.getTargetEntity().entityType === EntityTypes.DOCUMENT
                ? extractDataAssociations(persistence, relationship, instance)
                : debug(`relationship=`, relationship)
            )
        : Promise.reject(new Error(`Invalid relationship id:${body.elementId}.`))
    )
;
