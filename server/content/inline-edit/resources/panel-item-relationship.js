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
                    return warpjsUtils.createResource('', {
                        type: relationship.type,
                        id: relationship.id,
                        name: relationship.name,
                        description: relationship.desc,
                        label: relationship.label || relationship.name
                    });
                } else {
                    debug(`TODO: other relationship?`);
                }
            })
        : null
    )
;
