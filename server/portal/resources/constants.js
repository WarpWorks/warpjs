const _ = require('lodash');
// const debug = require('debug')('W2:portal:resources/constants');

const BasicTypes = require('./../../../lib/core/basic-types');
const ComplexTypes = require('./../../../lib/core/complex-types');

function generateIndicators(obj, itemToCompare) {
    // debug(`generateIndicators(obj, itemToCompare='${itemToCompare}'): obj=`, obj);
    return Object.freeze(_.reduce(
        _.values(obj),
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
        return generateIndicators(this.PAGE_VIEW_STYLES, style);
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
        return generateIndicators(this.PANEL_NAMES, name);
    },

    PANEL_ITEM_NAMES: Object.freeze({
        Sidebar: 'Sidebar',
        Badges: 'Badges',
        Summary: 'Summary',
        Authors: 'Authors',
        Contributors: 'Contributors'
    }),

    isSpecializedPanel(name) {
        return _.values(this.PANEL_ITEM_NAMES).indexOf(name) !== -1;
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

    isOfRelationshipPanelItemStyle(panelItem) {
        return generateIndicators(this.RELATIONSHIP_PANEL_ITEM_STYLES, panelItem.style);
    },

    PANEL_ITEM_TYPES: Object.freeze({
        [ComplexTypes.SeparatorPanelItem]: ComplexTypes.SeparatorPanelItem,
        [ComplexTypes.RelationshipPanelItem]: ComplexTypes.RelationshipPanelItem,
        [ComplexTypes.BasicPropertyPanelItem]: ComplexTypes.BasicPropertyPanelItem,
        [ComplexTypes.EnumPanelItem]: ComplexTypes.EnumPanelItem
    }),

    isOfPanelItemType(panelItem) {
        return generateIndicators(this.PANEL_ITEM_TYPES, panelItem.type);
    },

    isOfPropertyType: (type) => BasicTypes.typesCheck(type)
});
