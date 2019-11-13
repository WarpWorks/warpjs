const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
// const debug = require('./debug')('panel');
const panelItemsByPanel = require('./panel-items-by-panel');

module.exports = async (persistence, panel, instance) => {
    const resource = warpjsUtils.createResource('', {
        type: panel.type,
        id: panel.id,
        name: panel.name,
        description: panel.desc,
        label: panel.label || panel.name,
        labelLength: (panel.label || panel.name).trim().length,
        style: panel.style,
        reference: {
            type: "Relationship",
            id: "32"
        }
    });

    const panelItems = await panelItemsByPanel(persistence, panel, instance);

    const foundAggregationFilters = panelItems.filter((pi) => pi.hasAggregationFilters);
    if (foundAggregationFilters && foundAggregationFilters.length) {
        resource.hasAggregationFilters = true;

        resource.embed('aggregationFilters', foundAggregationFilters.reduce(
            (cumulator, pi) => {
                try {
                    return cumulator.concat(pi._embedded.aggregationFilters);
                } finally {
                    delete pi._embedded.aggregationFilters;
                }
            },
            []
        ));

        resource.embed('aggregationFiltersItems', foundAggregationFilters.reduce(
            (cumulator, pi) => {
                try {
                    return cumulator.concat(pi._embedded.aggregationFiltersItems);
                } finally {
                    delete pi._embedded.aggregationFiltersItems;
                }
            },
            []
        ));

        resource.embed('aggregationDocuments', foundAggregationFilters.reduce(
            (cumulator, pi) => {
                try {
                    return cumulator.concat(pi._embedded.aggregationDocuments);
                } finally {
                    delete pi._embedded.aggregationDocuments;
                }
            },
            []
        ));
    }

    resource.embed('items', panelItems);
    resource.showPanel = Boolean(panelItems.filter(
        (pi) => pi.showItem && !pi.visibleInEditOnly && pi.type !== ComplexTypes.SeparatorPanelItem
    ).length);
    resource.visibleInEditOnly = panelItems.filter((pi) => !pi.visibleInEditOnly).length === 0;

    return resource;
};
