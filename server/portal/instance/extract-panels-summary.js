/**
 *  Insight's summary is composed from:
 *
 *  - Panel named "Summary"
 *  - RelationshipPanelItem named "Summary"
 *  - relationship's targetEntity === Paragraph
 *  - composed with up to 3 paragraphs.
 */

// const debug = require('debug')('W2:portal:instance/extract-panels-summary');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../resources/constants');
const paragraphsByRelationship = require('./../resources/paragraphs-by-relationship');

module.exports = (persistence, entity, instance, entityPanels) => Promise.resolve()
    .then(() => entityPanels.find((panel) => panel.name === constants.PANEL_NAMES.Summary))
    .then((panel) => panel ? panel.getPanelItems().find((panelItem) => panelItem.name === constants.PANEL_ITEM_NAMES.Summary) : null)
    .then((panelItem) => panelItem ? panelItem.getRelationship() : null)
    .then((relationship) => Promise.resolve()
        .then(() => relationship ? paragraphsByRelationship(persistence, relationship, instance) : [])
        .then((paragraphResources) => paragraphResources.slice(0, 3))
        .then((paragraphResources) => paragraphResources.map((paragraphResource) => warpjsUtils.createResource('', {
            id: paragraphResource.id,
            title: paragraphResource.name,
            content: paragraphResource.description,
            reference: {
                type: relationship.type,
                id: relationship.id,
                name: relationship.name
            }
        })))
    )
;
