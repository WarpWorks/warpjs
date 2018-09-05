// const debug = require('debug')('W2:portal:resources/overview-by-entity');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const EntityTypes = require('./../../../lib/core/entity-types');
const paragraphsByRelationship = require('./paragraphs-by-relationship');

function buildTOCLevel(items, level, index) {
    let cumulator = [];

    for (let i = index; i < items.length; i++) {
        const item = items[i];
        const currentLevel = parseInt(item.level[1], 10);

        if (currentLevel < level) {
            // We went up one level. End.
            break;
        } else if (currentLevel === level) {
            const resource = warpjsUtils.createResource('', {
                id: item.id,
                name: item.name
            });
            cumulator.push(resource);

            resource.embed('items', buildTOCLevel(items, level + 1, i + 1));
        }
    }

    return cumulator;
}

module.exports = (persistence, entity, instance, isSpecializedPageViewStyle, pageOverview) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        type: "Panel",
        id: null,
        name: "Overview",
        description: "Document Overview",
        label: entity.getDisplayName(instance),
        isOverviewPanel: true,
        style: 'Transparent'
    }))
    .then((resource) => Promise.resolve()
        .then(() => entity.getRelationshipByName('Overview'))
        .then((relationship) => Promise.resolve()
            .then(() => {
                resource.id = relationship.id;

                if (!relationship.isAggregation || relationship.getTargetEntity().entityType === EntityTypes.EMBEDDED) {
                    resource.reference = {
                        type: relationship.type,
                        id: relationship.id
                    };
                }
            })
            .then(() => paragraphsByRelationship(persistence, relationship, instance))
        )
        .then((items) => {
            if (items && items.length) {
                resource.showPanel = true;
                resource.embed('items', items);

                // Need to convert paragraph into TOC.
                if (pageOverview) {
                    resource.embed('tableOfContents', buildTOCLevel(items, 1, 0));
                }
            }
        })
        .then(() => resource)
    )
;
