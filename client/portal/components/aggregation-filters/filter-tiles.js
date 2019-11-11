import * as constants from './constants';
import hide from './hide';
import matchSearchValue from './match-search-value';
import repositionPanelItems from './reposition-panel-items';
import show from './show';

// import _debug from './debug'; const debug = _debug('filter-tiles');

const showRelnPanelItem = (relnPanelItem, item, counters) => {
    $(`.warpjs-relationship-panel-item-id-${item.docId}`, relnPanelItem).each((index, relnPanelItemDoc) => {
        counters.visibleItems += 1;

        show(relnPanelItemDoc);
        show(relnPanelItem);

        $(relnPanelItem).closest('.warpjs-panel-section').each((index, panelItem) => {
            show(panelItem);

            $(panelItem).closest('.panel').each((index, panel) => {
                $('> .panel-heading', panel).each((index, panelHeading) => {
                    show(panelHeading);
                });

                $(panel).closest('.row.warpjs-panel').each((index, panelContainer) => {
                    show(panelContainer);
                });
            });
        });
    });
};

export default (selection, searchValue, aggregationFiltersItems) => {
    const counters = {
        visibleItems: 0
    };
    const mainBody = $('.warpjs-page-view-main-body').get(0);

    if (!mainBody) {
        return;
    }

    // Make everything is visible at the beginning.
    $(`.${constants.HIDE}`, mainBody).each((index, item) => show(item));
    $('.warpjs-relationship-panel-item-tile', mainBody).removeClass(constants.ALL_VISIBLE_CLASSES);

    $(`.${constants.ELEMENTS.EMPTY_RESULTS}`).each((i, element) => hide(element));

    const relnId = selection ? selection.relnId : null;

    if (relnId || searchValue) {
        const filteredAggregationFiltersItems = searchValue
            ? aggregationFiltersItems.filter((item) => matchSearchValue(searchValue, item))
            : aggregationFiltersItems
        ;

        // each pageview panel
        $('> .warpjs-panel', mainBody).each((index, panelContainer) => {
            hide(panelContainer);

            $('.panel', panelContainer).each((index, panel) => {
                $('.panel-heading', panel).each((index, panelHeader) => {
                    hide(panelHeader);
                });

                $('.panel-body .warpjs-panel-section', panel).each((index, panelItem) => {
                    hide(panelItem);

                    $('> .warpjs-relationship-panel-item', panelItem).each((index, relnPanelItem) => {
                        hide(relnPanelItem);

                        $('> .warpjs-value > .warpjs-value-item-container', relnPanelItem).each((index, relnPanelItemDoc) => hide(relnPanelItemDoc));

                        if (relnId) {
                            if ($(relnPanelItem).hasClass(`warpjs-relationship-id-${relnId}`)) {
                                filteredAggregationFiltersItems.forEach((item) => {
                                    if ((item.firstLevelRelnId === selection.entityId) && (item.firstLevelDocId === selection.firstLevelId)) {
                                        if (selection.secondLevelId) {
                                            if (item.secondLevelDocId === selection.secondLevelId) {
                                                showRelnPanelItem(relnPanelItem, item, counters);
                                            }
                                        } else {
                                            showRelnPanelItem(relnPanelItem, item, counters);
                                        }
                                    }
                                });
                            }
                        } else if (searchValue) {
                            filteredAggregationFiltersItems.forEach((item) => {
                                showRelnPanelItem(relnPanelItem, item, counters);
                            });
                        }

                        repositionPanelItems(relnPanelItem);
                    });
                });
            });
        });
    }
    if (!counters.visibleItems && relnId) {
        $(`.${constants.ELEMENTS.EMPTY_RESULTS}`).each((i, element) => show(element));
    }
};
