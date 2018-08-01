// const debug = require('debug')('W2:portal:instance/extract-panels-badges');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../resources/constants');
const overviewByEntity = require('./../resources/overview-by-entity');

module.exports = (persistence, entity, instance, entityPanels) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
    }))
    .then((resource) => Promise.resolve()
        .then(() => entityPanels.find((panel) => panel.name === constants.PANEL_NAMES.Badges))
        .then((panel) => panel
            ? panel.getPanelItems().find((panelItem) => panelItem.name === constants.PANEL_ITEM_NAMES.Badges)
            : null
        )
        .then((panelItem) => {
            if (panelItem) {
                resource.name = panelItem.name;
                resource.label = panelItem.label || panelItem.name;
                return panelItem.getRelationship();
            }
        })
        .then((relationship) => Promise.resolve()
            .then(() => relationship
                ? relationship.getDocuments(persistence, instance)
                : []
            )
            .then((badges) => Promise.map(
                badges,
                (badge) => Promise.resolve()
                    .then(() => RoutesInfo.expand('entity', badge))
                    .then((href) => warpjsUtils.createResource(href, {
                        type: badge.type,
                        id: badge.id,
                        name: badge.Name,
                        label: relationship.getDisplayName(badge)
                    }))
                    .then((badgeResource) => Promise.resolve()
                        .then(() => badgeResource.link('preview', RoutesInfo.expand('W2:portal:preview', badge)))

                        .then(() => overviewByEntity(persistence, relationship.getTargetEntity(), badge))
                        .then((overview) => overview && overview._embedded ? overview._embedded.items : null)
                        .then((paragraphs) => paragraphs && paragraphs.length ? paragraphs[0] : null)
                        .then((paragraph) => {
                            if (paragraph) {
                                badgeResource.description = paragraph.description;
                                return paragraph._embedded ? paragraph._embedded.images : null;
                            }
                        })
                        .then((images) => images && images.length ? images[0] : null)
                        .then((image) => image && image._links ? image._links.self : null)
                        .then((self) => self ? self.href : null)
                        .then((href) => {
                            if (href) {
                                badgeResource.link('image', href);
                            }
                        })

                        .then(() => badgeResource)
                    )
            ))
            .then((badgeResources) => resource.embed('items', badgeResources))
            .then(() => {
                resource.showPanel = Boolean(resource._embedded.items.length);
            })
        )
        .then(() => resource)
    )
;
