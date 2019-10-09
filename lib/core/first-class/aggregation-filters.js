class AggregationFilters {
    static getRelationshipFilter(document, relationshipId) {
        if (!document._meta) {
            document._meta = {};
        }

        if (!document._meta.aggregationFilters) {
            document._meta.aggregationFilters = [];
        }

        let aggregationFilter = document._meta.aggregationFilters.find((aggregation) => aggregation.id === relationshipId);
        if (!aggregationFilter) {
            aggregationFilter = {
                id: relationshipId,
                position: document._meta.aggregationFilters.length,
                entities: []
            };

            document._meta.aggregationFilters.push(aggregationFilter);
        }

        return aggregationFilter;
    }

    static addFilter(document, relationshipId, entityId) {
        const aggregationFilter = AggregationFilters.getRelationshipFilter(document, relationshipId);
        const foundEntity = aggregationFilter.entities.find((entity) => entity.id === entityId);
        if (!foundEntity) {
            aggregationFilter.entities.push({
                id: entityId,
                position: aggregationFilter.entities.length
            });
        }
    }
};

module.exports = AggregationFilters;
