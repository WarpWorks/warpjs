// const _ = require('lodash');
// const debug = require('debug')('W2:portal:instance/models/page-view');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../resources/constants');
const extractMainBodyPanels = require('./extract-panels-main-body');
const extractSidebarPanels = require('./extract-panels-sidebar');
const extractSummaryPanels = require('./extract-panels-summary');
const extractBadgesPanels = require('./extract-panels-badges');

const communityByEntity = require('./../resources/community-by-entity');
const overviewByEntity = require('./../resources/overview-by-entity');

module.exports = (persistence, pageView, instance, customStyle) => Promise.resolve()
    .then(() => customStyle || pageView.style || constants.PAGE_VIEW_STYLES.Plain)
    .then((style) => warpjsUtils.createResource('', {
        id: pageView.id,
        type: pageView.type,
        name: pageView.name,
        desc: pageView.desc,
        label: pageView.label,
        style,
        isOfStyle: constants.isOfPageViewStyle(style),
        isSpecializedPageViewStyle: constants.isSpecializedPageViewStyle(style)
    }))
    .then((resource) => Promise.resolve()
        // Add overview to main body
        .then(() => overviewByEntity(persistence, pageView.getParentEntity(), instance, resource.isSpecializedPageViewStyle, true))
        .then((overviewPanel) => resource.embed('mainBodyPanels', overviewPanel))

        // Define the authors for all pages
        .then(() => communityByEntity(persistence, pageView.getParentEntity(), instance))
        .then((community) => {
            if (community) {
                resource.embed('communities', community);
            }
        })

        // Process defined panels
        .then(() => pageView.getPanels(true))
        .then((panels) => Promise.resolve()
            .then(() => extractMainBodyPanels(persistence, pageView, instance, panels, resource.isSpecializedPageViewStyle))
            .then((mainBodyPanels) => {
                if (mainBodyPanels && mainBodyPanels.length) {
                    resource.embed('mainBodyPanels', mainBodyPanels);
                }
            })

            .then(() => {
                if (resource.isSpecializedPageViewStyle) {
                    return Promise.resolve()
                        .then(() => extractSummaryPanels(persistence, pageView, instance, panels))
                        .then((summaryPanels) => {
                            if (summaryPanels && summaryPanels.length) {
                                resource.embed('summaries', summaryPanels);
                            }
                        })

                        .then(() => extractSidebarPanels(persistence, pageView, instance, panels))
                        .then((sidebarPanels) => {
                            if (sidebarPanels && sidebarPanels.length) {
                                resource.embed('sidebars', sidebarPanels);
                            }
                        })

                        .then(() => extractBadgesPanels(persistence, pageView, instance, panels))
                        .then((badgesPanel) => {
                            if (badgesPanel) {
                                resource.embed('badges', badgesPanel);
                            }
                        })
                    ;
                }
            })
        )

        .then(() => resource)
    )
;
