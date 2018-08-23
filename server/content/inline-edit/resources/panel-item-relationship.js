const debug = require('debug')('W2:content:inline-edit/resources/panel-item-relationship');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (persistence, relationshipPanelItem, instance) => Promise.resolve()
    .then(() => relationshipPanelItem.hasRelationship() ? relationshipPanelItem.getRelationship() : null)
    .then((relationship) => relationship
        ? Promise.resolve()
            .then(() => {
                if (relationship.isAggregation && relationship.getTargetEntity().entityType === 'Document') {
                    debug(`This is not an association nor a paragraph`);
                    return null;
                } else if (!relationship.isAggregation && relationship.getTargetEntity().entityType === 'Document') {
                    // Association
                    return warpjsUtils.createResource('', {
                        type: relationship.type,
                        id: relationship.id,
                        name: relationship.label || relationship.name,
                        description: relationship.desc,
                        reference: {
                            type: relationship.type,
                            id: relationship.id,
                            name: relationship.name
                        }
                    });
                } else {
                    debug(`TODO: other relationship?`);
                }
            })
        : null
    )
;
