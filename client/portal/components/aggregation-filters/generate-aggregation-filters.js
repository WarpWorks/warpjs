import { orchestrators } from './flux';

const byName = (a, b) => a.name.localeCompare(b.name);

export default (dispatch, pageViewAggregationFilters, pageViewAggregationFiltersItems) => (pageViewAggregationFilters || []).map((reln) => ({
    id: reln.id,
    entities: (reln.entities || []).map((entity) => {
        const aggregationFiltersItems = (pageViewAggregationFiltersItems || []).filter((aggregationFiltersItem) => aggregationFiltersItem.firstLevelRelnId === entity.id);

        return {
            id: entity.id,
            name: entity.label,
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
                                    onClick: (selected) => orchestrators.select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.firstLevelDocId, aggregationFiltersItem.secondLevelDocId)
                                });

                                foundParent.items.sort(byName);
                            }
                        } else {
                            cumulator.push({
                                id: aggregationFiltersItem.firstLevelDocId,
                                name: aggregationFiltersItem.firstLevelDocName,
                                onClick: (selected) => orchestrators.select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.firstLevelDocId),
                                items: [{
                                    id: aggregationFiltersItem.secondLevelDocId,
                                    name: aggregationFiltersItem.secondLevelDocName,
                                    onClick: (selected) => orchestrators.select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.firstLevelDocId, aggregationFiltersItem.secondLevelDocId)
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
                                onClick: (selected) => orchestrators.select(dispatch, selected, reln.id, entity.id, aggregationFiltersItem.firstLevelDocId)
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
