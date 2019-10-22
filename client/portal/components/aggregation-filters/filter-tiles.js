// import _debug from './debug'; const debug = _debug('filter-tiles');

const RELATIONSHIP_PANEL_ITEM_SELECTOR = '.warpjs-relationship-panel-item.warpjs-relationship-style-Tile';
const STILL_VISIBLE = 'warpjs-aggregation-filters-still-visible';
const STILL_VISIBLE_AS_FIRST = 'warpjs-aggregation-filter-still-visible-as-first';
const STILL_VISIBLE_AS_SECOND = 'warpjs-aggregation-filter-still-visible-as-second';
const STILL_VISIBLE_AS_THIRD = 'warpjs-aggregation-filter-still-visible-as-third';
const ALL_VISIBLE_CLASSES = [
    STILL_VISIBLE,
    STILL_VISIBLE_AS_FIRST,
    STILL_VISIBLE_AS_SECOND,
    STILL_VISIBLE_AS_THIRD
];

const SUB_CLASS = [
    STILL_VISIBLE_AS_FIRST,
    STILL_VISIBLE_AS_SECOND,
    STILL_VISIBLE_AS_THIRD
];

export default (selection, aggregationFiltersItems) => {
    if (selection) {
        if (selection.relnId) {
            $(`${RELATIONSHIP_PANEL_ITEM_SELECTOR}`).each((index, panel) => {
                if ($(panel).hasClass(`warpjs-relationship-id-${selection.relnId}`)) {
                    $(panel).show();

                    $('.warpjs-relationship-panel-item-tile', panel).removeClass(ALL_VISIBLE_CLASSES).hide();

                    aggregationFiltersItems.forEach((item) => {
                        if (item.firstLevelRelnId === selection.entityId) {
                            if (item.firstLevelDocId === selection.firstLevelId) {
                                if (selection.secondLevelId) {
                                    if (item.secondLevelDocId === selection.secondLevelId) {
                                        $(`.warpjs-relationship-panel-item-id-${item.docId}`, panel).addClass(STILL_VISIBLE).show();
                                    }
                                } else {
                                    $(`.warpjs-relationship-panel-item-id-${item.docId}`, panel).addClass(STILL_VISIBLE).show();
                                }
                            }
                        }
                    });

                    $(`.warpjs-relationship-panel-item-tile.${STILL_VISIBLE}`, panel).each((index, item) => {
                        $(item).addClass(SUB_CLASS[index % 3]);
                    });
                } else {
                    $(panel).hide();
                }
            });
        } else {
            // No selection, show everything.
            $(RELATIONSHIP_PANEL_ITEM_SELECTOR).show();
            $(`${RELATIONSHIP_PANEL_ITEM_SELECTOR} .warpjs-relationship-panel-item-tile`).show();
        }
    }
};
