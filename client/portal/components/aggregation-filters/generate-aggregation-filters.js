const byName = (a, b) => a.name.localeCompare(b.name);

export default (dispatch, pageViewAggregationFilters, pageViewAggregationFiltersItems, showingAll, select, showAll) => (pageViewAggregationFilters || []).map((reln) => ({
    id: reln.id,
    entities: (reln.entities || []).map((entity) => {
        const aggregationFiltersItems = (pageViewAggregationFiltersItems || []).filter((aggregationFiltersItem) => aggregationFiltersItem.firstLevelRelnId === entity.id);

        const foundShowingAll = (showingAll || []).find((item) => item.relnId === reln.id && item.entityId === entity.id);

        return {
            id: entity.id,
            name: entity.label,
            showAll: () => showAll(dispatch, reln.id, entity.id),
            showLess: () => showAll(dispatch, reln.id, entity.id, false),
            showingAll: foundShowingAll ? foundShowingAll.showAll : false,
            items: aggregationFiltersItems.reduce(
                (cumulator, aggregationFiltersItem) => {
                    if (entity.useParent) {
                        const foundParent = cumulator.find((item) => item.id === aggregationFiltersItem.firstLevelDocId);
                        if (foundParent) {
                            const foundChild = foundParent.items.find((item) => item.id === aggregationFiltersItem.secondLevelDocId);
                            if (!foundChild) {
                                foundParent.items.push({
                                    id: aggregationFiltersItem.secondLevelDocId,
                                    name: aggregationFiltersItem.secondLevelDocName,
                                    onClick: (selected) => select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.firstLevelDocId, aggregationFiltersItem.secondLevelDocId)
                                });

                                foundParent.items.sort(byName);
                            }
                        } else {
                            cumulator.push({
                                id: aggregationFiltersItem.firstLevelDocId,
                                name: aggregationFiltersItem.firstLevelDocName,
                                onClick: (selected) => select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.firstLevelDocId),
                                items: [{
                                    id: aggregationFiltersItem.secondLevelDocId,
                                    name: aggregationFiltersItem.secondLevelDocName,
                                    onClick: (selected) => select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.firstLevelDocId, aggregationFiltersItem.secondLevelDocId)
                                }]
                            });
                            cumulator.sort(byName);
                        }
                    } else {
                        const foundChild = cumulator.find((item) => item.id === aggregationFiltersItem.firstLevelDocId);
                        if (!foundChild) {
                            cumulator.push({
                                id: aggregationFiltersItem.firstLevelDocId,
                                name: aggregationFiltersItem.firstLevelDocName,
                                onClick: (selected) => select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.firstLevelDocId)
                            });

                            cumulator.sort(byName);
                        }
                    }
                    return cumulator;
                },
                []
            )
        };
    })
}));
