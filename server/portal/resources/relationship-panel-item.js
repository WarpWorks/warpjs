const debug = require('debug')('W2:portal:resources/relationship-panel-item');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const baseInfoByRelationship = require('./base-info-by-relationship');
const constants = require('./constants');
const paragraphsByRelationship = require('./paragraphs-by-relationship');

module.exports = (persistence, panelItem, instance) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        type: panelItem.type,
        id: panelItem.id,
        name: panelItem.name,
        description: panelItem.desc,
        label: panelItem.label || panelItem.name,
        style: panelItem.style
    }))
    .then((resource) => Promise.resolve()
        .then(() => panelItem.hasRelationship() ? panelItem.getRelationship() : null)
        .then((relationship) => {
            if (relationship) {
                if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Document) {
                    return paragraphsByRelationship(persistence, relationship, instance);
                } else if ((resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Csv) ||
                        (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.CsvColumns)) {
                    return baseInfoByRelationship(persistence, relationship, instance);
                } else {
                    debug(`TODO resource.style = '${resource.style}'`);
                }
            }
        })
        .then((items) => resource.embed('items', items))
        .then(() => resource)
    )
;
