const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../resources/constants');
// const debug = require('./debug')('extract-page-view');
const extractMainBodyPanels = require('./extract-panels-main-body');
const extractSidebarPanels = require('./extract-panels-sidebar');
const extractSummaryPanels = require('./extract-panels-summary');
const extractBadgesPanels = require('./extract-panels-badges');

const communityByEntity = require('./../resources/community-by-entity');
const overviewByEntity = require('./../resources/overview-by-entity');

module.exports = async (persistence, pageView, instance, customStyle) => {
    const style = customStyle || pageView.style || constants.PAGE_VIEW_STYLES.Plain;

    const resource = warpjsUtils.createResource('', {
        id: pageView.id,
        type: pageView.type,
        name: pageView.name,
        desc: pageView.desc,
        label: pageView.label,
        style,
        isOfStyle: constants.isOfPageViewStyle(style),
        isSpecializedPageViewStyle: constants.isSpecializedPageViewStyle(style)
    });

    // Add overview to main body
    const overviewPanel = await overviewByEntity(persistence, pageView.getParentEntity(), instance, resource.isSpecializedPageViewStyle, true);
    resource.embed('mainBodyPanels', overviewPanel);

    // Define the authors for all pages
    const community = await communityByEntity(persistence, pageView.getParentEntity(), instance);
    if (community) {
        resource.embed('communities', community);
    }

    // Process defined panels
    const panels = pageView.getPanels(true);

    const mainBodyPanels = await extractMainBodyPanels(persistence, pageView, instance, panels, resource.isSpecializedPageViewStyle);
    if (mainBodyPanels && mainBodyPanels.length) {
        resource.embed('mainBodyPanels', mainBodyPanels);
    }

    if (resource.isSpecializedPageViewStyle) {
        const summaryPanels = await extractSummaryPanels(persistence, pageView, instance, panels);
        if (summaryPanels && summaryPanels.length) {
            resource.embed('summaries', summaryPanels);
        }

        const sidebarPanels = await extractSidebarPanels(persistence, pageView, instance, panels);
        if (sidebarPanels && sidebarPanels.length) {
            resource.embed('sidebars', sidebarPanels);
        }

        const badgesPanel = await extractBadgesPanels(persistence, pageView, instance, panels);
        if (badgesPanel) {
            resource.embed('badges', badgesPanel);
        }
    }

    return resource;
};
