const _ = require('lodash');
const debug = require('debug')('W2:portal:resources/relationship-panel-item');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const baseInfoByRelationship = require('./base-info-by-relationship');
const basePanelItemInfo = require('./base-panel-item-info');
const constants = require('./constants');
const paragraphsByRelationship = require('./paragraphs-by-relationship');
const previewByEntity = require('./preview-by-entity');
const sortIntoColumns = require('./sort-into-columns');

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
                resource.isAssociation = !relationship.isAggregation;
                resource.id = relationship.id;

                if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Document) {
                    return paragraphsByRelationship(persistence, relationship, instance);
                } else if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Csv) {
                    return baseInfoByRelationship(persistence, relationship, instance);
                } else if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.CsvColumns) {
                    return Promise.resolve()
                        .then(() => baseInfoByRelationship(persistence, relationship, instance))
                        .then((items) => sortIntoColumns(items, 3))
                    ;
                } else if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Tile) {
                    return Promise.resolve()
                        .then(() => relationship.getDocuments(persistence, instance))
                        .then((docs) => docs.filter((doc) => doc.Name !== 'TEMPLATE'))
                        .then((docs) => Promise.map(
                            docs,
                            (doc) => previewByEntity(persistence, relationship.getTargetEntity(), doc)
                        ))
                    ;
                } else if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Preview) {
                    return Promise.resolve()
                        .then(() => relationship.getDocuments(persistence, instance))
                        .then((docs) => docs.filter((doc) => doc.Name !== 'TEMPLATE'))
                        .then((docs) => Promise.map(
                            docs,
                            (doc) => previewByEntity(persistence, relationship.getTargetEntity(), doc)
                        ))
                    ;
                } else if (resource.style === constants.RELATIONSHIP_PANEL_ITEM_STYLES.Vocabulary) {
                    return Promise.resolve()
                        .then(() => relationship.getDocuments(persistence, instance))
                        .then((docs) => docs.filter((doc) => doc.Name !== 'TEMPLATE'))
                        .then((docs) => Promise.map(
                            docs,
                            (doc) => Promise.resolve()
                                .then(() => RoutesInfo.expand('entity', doc))
                                .then((href) => warpjsUtils.createResource(href, {
                                    type: doc.type,
                                    id: doc.id,
                                    name: doc.Name,
                                    definition: doc.Definition,
                                    resources: doc.Resources || doc.Ressources,
                                    label: relationship.getDisplayName(doc)
                                }))
                        ))
                        .then((docResources) => docResources.sort((a, b) => (a.label || '').localeCompare(b.label || '')))
                        .then((docResources) => docResources.reduce(
                            (cumulator, docResource) => {
                                const letter = docResource.label[0].toUpperCase();

                                let foundLetter = cumulator.find((letterResource) => letterResource.letter === letter);
                                if (!foundLetter) {
                                    cumulator.push(warpjsUtils.createResource('', {
                                        letter
                                    }));

                                    foundLetter = cumulator.find((letterResource) => letterResource.letter === letter);
                                }

                                foundLetter.embed('items', docResource);

                                return cumulator;
                            },
                            []
                        ))
                    ;
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
