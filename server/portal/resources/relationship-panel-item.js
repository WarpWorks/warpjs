const extend = require('lodash/extend');
const Promise = require('bluebird');

const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const AggregationFilters = require('./../../../lib/core/first-class/aggregation-filters');
const Document = require('./../../../lib/core/first-class/document');
const Documents = require('./../../../lib/core/first-class/documents');
const baseInfoByRelationship = require('./base-info-by-relationship');
const basePanelItemInfo = require('./base-panel-item-info');
const constants = require('./constants');
const paragraphsByRelationship = require('./paragraphs-by-relationship');
const previewByEntity = require('./preview-by-entity');
const RELATIONSHIP_PANEL_ITEM_STYLES = require('./../../../lib/core/relationship-panel-item-styles');
const routes = require('./../../../lib/constants/routes');
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
        const targetEntity = relationship.getTargetEntity();

        const href = RoutesInfo.expand(routes.content.instanceRelationshipItems, {
            domain: domain.name,
            type: instance.type,
            id: instance.id,
            relationship: relationship.name
        });

        resource.link('self', href);

        resource.isAssociation = !relationship.isAggregation;
        resource.isDocument = targetEntity.isDocument();
        resource.id = relationship.id;

        if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.Document) {
            items = await paragraphsByRelationship(persistence, relationship, instance);
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.Csv) {
            items = await baseInfoByRelationship(persistence, relationship, instance);
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.CsvColumns) {
            const itemsToSort = await baseInfoByRelationship(persistence, relationship, instance);
            items = sortIntoColumns(itemsToSort, 3);
        } else if (resource.style === RELATIONSHIP_PANEL_ITEM_STYLES.Tile) {
            const aggregationFilters = AggregationFilters.getRelationshipFilter(instance, relationship.id);
            resource.hasAggregationFilters = Boolean(aggregationFilters && aggregationFilters.entities && aggregationFilters.entities.length);

            const docs = await relationship.getDocuments(persistence, instance);
            const visibleOnlyDocs = docs.filter(visibleOnly);
            items = await Promise.map(
                visibleOnlyDocs,
                async (doc) => previewByEntity(persistence, targetEntity, doc)
            );

            if (resource.hasAggregationFilters) {
                resource.embed('aggregationFilters', aggregationFilters);

                const targetEntityRelationships = targetEntity.getRelationships().filter((reln) => !reln.isAggregation);
                const relationshipsInfo = targetEntityRelationships
                    .filter((reln) => !reln.isReverse())
                    .map((reln) => ({
                        id: reln.id,
                        name: reln.name,
                        target: reln.getTargetEntity().id,
                        reln
                    }))
                ;

                const relationshipsToKeep = aggregationFilters.entities.reduce(
                    (cumulator, targetEntity) => {
                        const shouldKeep = relationshipsInfo.filter((reln) => reln.target === targetEntity.id);
                        if (shouldKeep && shouldKeep.length) {
                            return cumulator.concat(shouldKeep.map((reln) => ({
                                ...reln,
                                label: targetEntity.label || null,
                                useParent: targetEntity.useParent || false
                            })));
                        } else {
                            return cumulator;
                        }
                    },
                    []
                );

                const aggregationFiltersItems = await Promise.reduce(
                    visibleOnlyDocs,
                    async (cumulator, doc) => Promise.reduce(
                        relationshipsToKeep,
                        async (cumulator, relnToKeep) => {
                            // debug(`doc=${doc.type}/${doc.id}/${doc.Name}, relnToKeep=${relnToKeep.id}/${relnToKeep.name}/${relnToKeep.useParent}/${relnToKeep.label}`);

                            const associatedDocs = await relnToKeep.reln.getDocuments(persistence, doc);
                            const relnEntity = relnToKeep.reln.getTargetEntity();

                            return Promise.reduce(
                                associatedDocs,
                                async (cumulator, associatedDoc) => {
                                    const item = {
                                        docType: doc.type,
                                        docId: doc.id,
                                        docName: domain.getDisplayName(doc),
                                        firstLevelRelnId: relnEntity.id,
                                        firstLevelDocId: associatedDoc.id,
                                        firstLevelDocName: domain.getDisplayName(associatedDoc)
                                    };

                                    if (relnToKeep.useParent) {
                                        const parentData = await relnEntity.getParentData(persistence, associatedDoc);
                                        item.secondLevelDocId = item.firstLevelDocId;
                                        item.secondLevelDocName = item.firstLevelDocName;
                                        item.firstLevelDocId = parentData.instance.id;
                                        item.firstLevelDocName = domain.getDisplayName(parentData.instance);
                                    }

                                    return cumulator.concat(item);
                                },
                                cumulator
                            );
                        },
                        cumulator
                    ),
                    []
                );
                resource.embed('aggregationFiltersItems', aggregationFiltersItems);
            }
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
                async (doc) => previewByEntity(persistence, targetEntity, doc)
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
