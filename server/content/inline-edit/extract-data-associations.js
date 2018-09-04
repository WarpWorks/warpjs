// const debug = require('debug')('W2:content:inline-edit/extract-data-associations');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const EntityTypes = require('./../../../lib/core/entity-types');

module.exports = (persistence, entity, instance, body) => Promise.resolve()
    .then(() => entity.getRelationshipById(body.elementId))
    .then((relationship) => relationship
        ? Promise.resolve()
            .then(() => relationship.isAggregation && relationship.getTargetEntity().entityType === EntityTypes.DOCUMENT
                ? Promise.reject(new Error(`Relationship ${relationship.name} is not an association.`))
                : null)
            .then(() => !relationship.isAggregation && relationship.getTargetEntity().entityType === EntityTypes.DOCUMENT
                ? Promise.resolve()
                    .then(() => warpjsUtils.createResource('', {
                        type: relationship.type,
                        id: relationship.id,
                        name: relationship.label || relationship.name,
                        description: relationship.desc,
                        reference: {
                            type: relationship.type,
                            id: relationship.id,
                            name: relationship.name
                        }
                    }))
                : null
            )
        : Promise.reject(new Error(`Invalid relationship id:${body.elementId}.`))
    )
;
