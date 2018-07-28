const _ = require('lodash');
const debug = require('debug')('W2:portal:resources/relationship-panel-item');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const baseInfoByRelationship = require('./base-info-by-relationship');
const basePanelItemInfo = require('./base-panel-item-info');
const constants = require('./constants');
const paragraphsByRelationship = require('./paragraphs-by-relationship');

module.exports = (persistence, panelItem, instance) => Promise.resolve()
    .then(() => basePanelItemInfo(panelItem))
    .then((basePanelItemInfo) => _.extend({}, basePanelItemInfo, {
        style: panelItem.style,
        isOfStyle: constants.isOfRelationshipPanelItemStyle(panelItem)
    }))
    .then((resourceInfo) => warpjsUtils.createResource('', resourceInfo))
    .then((resource) => Promise.resolve()
        .then(() => panelItem.hasRelationship() ? panelItem.getRelationship() : null)
        .then((relationship) => {
            if (relationship) {
                if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Document) {
                    return paragraphsByRelationship(persistence, relationship, instance);
                } else if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Csv) {
                    return baseInfoByRelationship(persistence, relationship, instance);
                } else if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.CsvColumns) {
                    return Promise.resolve()
                        .then(() => baseInfoByRelationship(persistence, relationship, instance))
                        .then((items) => {
                            // We want the items to be sorted by column-down
                            const numberOfColumns = 3;
                            const itemsPerColumn = Math.ceil(items.length / numberOfColumns);
                            const resortedItems = [];
                            for (let i = 0; i < itemsPerColumn; i++) {
                                for (let j = 0; j < numberOfColumns; j++) {
                                    const targetIndex = i + (j * itemsPerColumn);
                                    if (targetIndex < items.length) {
                                        resortedItems.push(items[targetIndex]);
                                    }
                                }
                            }

                            return resortedItems;
                        });
                } else {
                    debug(`TODO resource.style = '${resource.style}'`);
                }
            }
        })
        .then((items) => {
            if (items && items.length) {
                resource.showItem = true;
                resource.embed('items', items);
            }
        })
        .then(() => resource)
    )
;
