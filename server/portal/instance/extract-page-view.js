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

    if (resource.hasAggregationFilters) {
        resource.embed('aggregationFilters', overviewPanel._embedded.aggregationFilters);
        delete overviewPanel._embedded.aggregationFilters;

        resource.embed('aggregationFiltersItems', overviewPanel._embedded.aggregationFiltersItems);
        delete overviewPanel._embedded.aggregationFiltersItems;
    }

    // Define the authors for all pages
    const community = await communityByEntity(persistence, pageView.getParentEntity(), instance);
    if (community) {
        resource.embed('communities', community);
    }

    // Process defined panels
    const panels = pageView.getPanels(true);

    const mainBodyPanels = await extractMainBodyPanels(persistence, pageView, instance, panels, resource.isSpecializedPageViewStyle);
    if (mainBodyPanels && mainBodyPanels.length) {
        const foundAggregationFilters = mainBodyPanels.filter((panel) => panel.hasAggregationFilters);
        if (foundAggregationFilters && foundAggregationFilters.length) {
            resource.hasAggregationFilters = true;
            resource.embed('aggregationFilters', foundAggregationFilters.reduce(
                (cumulator, panel) => {
                    try {
                        return cumulator.concat(panel._embedded.aggregationFilters);
                    } finally {
                        delete panel._embedded.aggregationFilters;
                    }
                },
                []
            ));

            resource.embed('aggregationFiltersItems', foundAggregationFilters.reduce(
                (cumulator, panel) => {
                    try {
                        return cumulator.concat(panel._embedded.aggregationFiltersItems);
                    } finally {
                        delete panel._embedded.aggregationFiltersItems;
                    }
                },
                []
            ));
        }

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
