import _debug from './debug'; const debug = _debug('filter-tiles');

const RELATIONSHIP_PANEL_ITEM_SELECTOR = '.warpjs-relationship-panel-item.warpjs-relationship-style-Tile';

export default (selection, aggregationFiltersItems) => {
    if (selection) {
        debug(`selection=`, selection);
        if (selection.relnId) {
            $(`${RELATIONSHIP_PANEL_ITEM_SELECTOR}`).each((index, panel) => {
                if ($(panel).hasClass(`warpjs-relationship-id-${selection.relnId}`)) {
                    aggregationFiltersItems.reduce(
                        (cumulator, item) => {
                            debug(`item=`, JSON.stringify(item));
                            if (item.firstLevelRelnId === selection.entityId) {
                                debug(`    same firstLevelRelnId.`);
                                if (item.firstLevelDocId === selection.firstLevelId) {
                                    if (selection.secondLevelId) {
                                        if (item.secondLevelDocId === selection.secondLevelId) {
                                            cumulator.add(item.docId);
                                            debug(`Keeping...`);
                                            $(`.warpjs-relationship-panel-item-id-${item.docId}`, panel).show();
                                        } else {
                                            if (!cumulator.has(item.docId)) {
                                                $(`.warpjs-relationship-panel-item-id-${item.docId}`, panel).hide();
                                            }
                                        }
                                    } else {
                                        cumulator.add(item.docId);
                                        $(`.warpjs-relationship-panel-item-id-${item.docId}`, panel).show();
                                    }
                                } else {
                                    if (!cumulator.has(item.docId)) {
                                        $(`.warpjs-relationship-panel-item-id-${item.docId}`, panel).hide();
                                    }
                                }
                            }
                            return cumulator;
                        },
                        new Set()
                    );
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
