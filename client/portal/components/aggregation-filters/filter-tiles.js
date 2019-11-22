import { ALL_VISIBLE_CLASSES, ELEMENTS, HIDE } from './constants';
import hide from './hide';
import repositionPanelItems from './reposition-panel-items';
import show from './show';

// import _debug from './debug'; const debug = _debug('filter-tiles');

const showRelnPanelItem = (relnPanelItem, id) => {
    $(`.warpjs-relationship-panel-item-id-${id}`, relnPanelItem).each((index, relnPanelItemDoc) => {
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

export default (searchValue, filters, visibleTiles) => {
    const mainBody = $('.warpjs-page-view-main-body').get(0);

    if (!mainBody) {
        return;
    }

    // Make everything is visible at the beginning.
    $(`.${HIDE}`, mainBody).each((index, item) => show(item));
    $('.warpjs-relationship-panel-item-tile', mainBody).removeClass(ALL_VISIBLE_CLASSES);

    $(`.${ELEMENTS.EMPTY_RESULTS}`).each((i, element) => hide(element));

    const selectedAggregation = filters.find((aggregation) => aggregation.selected);

    if (selectedAggregation || searchValue) {
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

                        if (selectedAggregation) {
                            if ($(relnPanelItem).hasClass(`warpjs-relationship-id-${selectedAggregation.id}`)) {
                                visibleTiles.forEach((id) => showRelnPanelItem(relnPanelItem, id));
                            }
                        } else if (searchValue) {
                            visibleTiles.forEach((id) => showRelnPanelItem(relnPanelItem, id));
                        }

                        repositionPanelItems(relnPanelItem);
                    });
                });
            });
        });
    }
};
