const Promise = require('bluebird');

const warpjsUtils = require('@warp-works/warpjs-utils');

const Documents = require('./../../../lib/core/first-class/documents');
const badgeCategoriesByEntity = require('./../resources/badge-categories-by-entity');
const constants = require('./../resources/constants');

// const debug = require('./debug')('extract-panels-badges');

module.exports = async (persistence, entity, instance, entityPanels) => {
    const panel = entityPanels.find((panel) => panel.name === constants.PANEL_NAMES.Badges);
    if (panel) {
        const panelResource = warpjsUtils.createResource('', {
            type: panel.type,
            id: panel.id,
            name: panel.name,
            label: panel.label || panel.name
        });

        const badgeCategories = await badgeCategoriesByEntity(persistence, entity, instance);
        if (badgeCategories && badgeCategories.length) {
            panelResource.showPanel = true;
            panelResource.embed('badgeCategories', badgeCategories);
        }

        // Find assigned badges.
        const panelItem = panel.getPanelItems().find((panelItem) => panelItem.name === constants.PANEL_ITEM_NAMES.Badges);
        if (panelItem) {
            const relationship = panelItem.getRelationship();
            const domain = relationship.getDomain();
            const assignedBadges = await relationship.getDocuments(persistence, instance);
            const bestDocuments = await Documents.bestDocuments(persistence, domain, assignedBadges);

            await Promise.each(
                bestDocuments,
                async (assignedBadge) => {
                    const entity = domain.getEntityByInstance(assignedBadge);
                    const assignedBadgeDefinitionRelationship = entity.getRelationshipByName('BadgeDefinition');
                    const assignedBadgeDefinitions = assignedBadgeDefinitionRelationship.getTargetReferences(assignedBadge);

                    await Promise.each(
                        assignedBadgeDefinitions,
                        async (assignedBadgeDefinition) => {
                            await Promise.each(
                                panelResource._embedded.badgeCategories,
                                async (badgeCategory) => {
                                    await Promise.each(
                                        badgeCategory._embedded.badgeDefinitions,
                                        async (badgeDefinition) => {
                                            // Update image url to matched stars level.
                                            if (badgeDefinition.id === assignedBadgeDefinition._id) {
                                                const stars = assignedBadge.Stars;
                                                const image = badgeDefinition._embedded.images.find((image) => image.name === stars);

                                                if (image) {
                                                    badgeDefinition._links.image.href = image._links.self.href;
                                                }
                                            }
                                        }
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }

        return panelResource;
    }
};
