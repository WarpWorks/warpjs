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

module.exports = (persistence, entity, instance, entityPanels) => Promise.resolve()
    .then(() => entityPanels.filter((panel) => panel.name === constants.PANEL_NAMES.Summary))
    .then((panels) => panels && panels.length ? panels[0] : null)
    .then((panel) => panel ? panel.getPanelItems().find((panelItem) => panelItem.name === constants.PANEL_ITEM_NAMES.Summary) : null)
    .then((panelItem) => panelItem ? panelItem.getRelationship() : null)
    .then((relationship) => relationship ? relationship.getDocuments(persistence, instance) : null)
    .then((paragraphs) => paragraphs ? paragraphs.sort(warpjsUtils.byPositionThenName) : null)
    .then((paragraphs) => paragraphs ? paragraphs.slice(0, 3) : null)
    .then((paragraphs) => paragraphs
        ? paragraphs.map((paragraph) => warpjsUtils.createResource('', {
            title: paragraph.Heading,
            content: paragraph.Content
        }))
        : null
    )
;
