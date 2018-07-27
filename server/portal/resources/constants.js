const _ = require('lodash');

function generateIndicators(items, itemToCompare) {
    return Object.freeze(_.reduce(
        items,
        (indicators, indicator) => _.extend(indicators, {
            [indicator]: itemToCompare === indicator
        }),
        {}
    ));
}

module.exports = Object.freeze({
    // FIXME: Loop in the real possible values from the level0 document.
    PAGE_VIEW_STYLES: Object.freeze({
        Plain: 'Plain',
        BoK: 'BoK',
        Insight: 'Insight',
        Testbed: 'Testbed'
    }),

    isOfPageViewStyle(style) {
        return generateIndicators(_.values(this.PAGE_VIEW_STYLES), style);
    },

    isSpecializedPageViewStyle(style) {
        return style && (style !== this.PAGE_VIEW_STYLES.Plain);
    },

    PANEL_NAMES: Object.freeze({
        Sidebar: 'Sidebar',
        Summary: 'Summary',
        Badges: 'Badges'
    }),

    isOfPanelName(name) {
        return generateIndicators(_.values(this.PANEL_NAMES), name);
    },

    PANEL_ITEM_NAMES: Object.freeze({
        Summary: 'Summary',
        Authors: 'Authors',
        Contributors: 'Contributors'
    }),

    isSpecializedPanel(style) {
        return _.values(this.PANEL_ITEM_NAMES).indexOf(style) !== -1;
    },

    RELATIONSHIP_PANEL_ITEM_STYLES: Object.freeze({
        Csv: 'CSV',
        CsvColumns: 'CSV_Columns',
        Carousel: 'Carousel',
        Table: 'Table',
        Preview: 'Preview',
        Tile: 'Tile',
        Vocabulary: 'Vocabulary',
        Document: 'Document'
    }),

    isOfRelationshipPanelItemStyle(style) {
        return generateIndicators(_.values(this.RELATIONSHIP_PANEL_ITEM_STYLES), style);
    }
});
