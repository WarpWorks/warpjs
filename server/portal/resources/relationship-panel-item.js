const extend = require('lodash/extend');
const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const Document = require('./../../../lib/core/first-class/document');
const Documents = require('./../../../lib/core/first-class/documents');
const baseInfoByRelationship = require('./base-info-by-relationship');
const basePanelItemInfo = require('./base-panel-item-info');
const constants = require('./constants');
const paragraphsByRelationship = require('./paragraphs-by-relationship');
const previewByEntity = require('./preview-by-entity');
const RELATIONSHIP_PANEL_ITEM_STYLES = require('./../../../lib/core/relationship-panel-item-styles');
const sortIntoColumns = require('./sort-into-columns');
const visibleOnly = require('./visible-only');

const debug = require('./debug')('relationship-panel-item');

module.exports = async (persistence, panelItem, instance) => {
    const panelItemInfo = basePanelItemInfo(panelItem);

    const resourceInfo = extend({}, panelItemInfo, {
        style: panelItem.style,
        isOfStyle: constants.isOfRelationshipPanelItemStyle(panelItem)
    });

    const resource = warpjsUtils.createResource('', resourceInfo);

    const relationship = panelItem.hasRelationship() ? panelItem.getRelationship() : null;

    let items;

    if (relationship) {
        const domain = relationship.getDomain();

        resource.isAssociation = !relationship.isAggregation;
        resource.id = relationship.id;

        if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.Document) {
            items = await paragraphsByRelationship(persistence, relationship, instance);
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.Csv) {
            items = await baseInfoByRelationship(persistence, relationship, instance);
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.CsvColumns) {
            const itemsToSort = await baseInfoByRelationship(persistence, relationship, instance);
            items = sortIntoColumns(itemsToSort, 3);
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.Tile) {
            const docs = await relationship.getDocuments(persistence, instance);
            const visibleOnlyDocs = docs.filter(visibleOnly);
            items = await Promise.map(
                visibleOnlyDocs,
                async (doc) => previewByEntity(persistence, relationship.getTargetEntity(), doc)
            );
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.BasicTile) {
            const docs = await relationship.getDocuments(persistence, instance);
            const visibleOnlyDocs = docs.filter(visibleOnly);
            const sortedDocs = visibleOnlyDocs.sort(warpjsUtils.byName);
            items = await Promise.map(
                sortedDocs,
                async (doc) => {
                    const href = await Document.getPortalUrl(persistence, domain.getEntityByInstance(doc), doc);
                    return warpjsUtils.createResource(href, {
                        id: doc.id,
                        type: doc.type,
                        name: doc.Name,
                        position: doc.Position,
                        description: doc.Description,
                        status: doc.status,
                        label: relationship.getDisplayName(doc)
                    });
                }
            );
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.Preview) {
            const docs = await relationship.getDocuments(persistence, instance);
            const visibleOnlyDocs = docs.filter(visibleOnly);
            items = await Promise.map(
                visibleOnlyDocs,
                async (doc) => previewByEntity(persistence, relationship.getTargetEntity(), doc)
            );
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.Vocabulary) {
            const docs = await relationship.getDocuments(persistence, instance);
            const visibleOnlyDocs = docs.filter(visibleOnly);

            const bestDocuments = await Documents.bestDocuments(persistence, domain, visibleOnlyDocs);

            const docResources = await Promise.map(
                bestDocuments,
                async (doc) => {
                    const href = await Document.getPortalUrl(persistence, domain.getEntityByInstance(doc), doc);
                    return warpjsUtils.createResource(href, {
                        type: doc.type,
                        id: doc.id,
                        name: doc.Name,
                        definition: doc.Definition,
                        resources: doc.Resources || doc.Ressources,
                        label: relationship.getDisplayName(doc)
                    });
                }
            );

            const sortedDocResources = docResources.sort((a, b) => (a.label || '').localeCompare(b.label || ''));
            items = await sortedDocResources.reduce(
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
            );
        } else {
            debug(`TODO resource.style = '${resource.style}'`);
        }
    }

    resource.showItem = Boolean(items && items.length);
    resource.embed('items', items);

    return resource;
};
