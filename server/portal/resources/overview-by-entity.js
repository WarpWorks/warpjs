const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const paragraphsByRelationship = require('./paragraphs-by-relationship');

module.exports = (persistence, entity, instance, isSpecializedPageViewStyle) => Promise.resolve()
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
        .then((relationship) => paragraphsByRelationship(persistence, relationship, instance))
        .then((items) => {
            if (items && items.length) {
                resource.showPanel = true;
                resource.embed('items', items);
            }
        })
        .then(() => resource)
    )
;
