// const debug = require('debug')('W2:portal:instance/extract-panels-badges');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const badgeCategoriesByEntity = require('./../resources/badge-categories-by-entity');
const constants = require('./../resources/constants');

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
            const assignedBadges = await relationship.getDocuments(persistence, instance);

            assignedBadges.forEach((assignedBadge) => {
                const domain = relationship.getDomain();
                const entity = domain.getEntityByInstance(assignedBadge);
                const assignedBadgeDefinitionRelationship = entity.getRelationshipByName('BadgeDefinition');
                const assignedBadgeDefinitions = assignedBadgeDefinitionRelationship.getTargetReferences(assignedBadge);

                assignedBadgeDefinitions.forEach((assignedBadgeDefinition) => {
                    panelResource._embedded.badgeCategories.forEach((badgeCategory) => {
                        badgeCategory._embedded.badgeDefinitions.forEach((badgeDefinition) => {
                            // Update image url to matched stars level.
                            if (badgeDefinition.id === assignedBadgeDefinition._id) {
                                const stars = assignedBadge.Stars;
                                const image = badgeDefinition._embedded.images.find((image) => image.name === stars);
                                badgeDefinition._links.self.href = RoutesInfo.expand('entity', assignedBadge);
                                if (image) {
                                    badgeDefinition._links.image.href = image._links.self.href;
                                }
                            };
                        });
                    });
                });
            });
        }

        return panelResource;
    }
};
