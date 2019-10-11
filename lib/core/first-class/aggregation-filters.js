// const debug = require('./debug')('aggregation-filters');

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
                id: entityId
            });
        }
        AggregationFilters.reposition(document, relationshipId);
    }

    static patchFilter(document, relationshipId, entityId, key, value) {
        const aggregationFilter = AggregationFilters.getRelationshipFilter(document, relationshipId);
        const foundEntity = aggregationFilter.entities.find((entity) => entity.id === entityId);
        if (foundEntity) {
            foundEntity[key] = value;
        }
    }

    static removeFilter(document, relationshipId, entityId) {
        const aggregationFilter = AggregationFilters.getRelationshipFilter(document, relationshipId);
        aggregationFilter.entities = aggregationFilter.entities.filter((entity) => entity.id !== entityId);
        AggregationFilters.reposition(document, relationshipId);
    }

    static reposition(document, relationshipId) {
        const aggregationFilter = AggregationFilters.getRelationshipFilter(document, relationshipId);
        aggregationFilter.entities.forEach((entity, position) => {
            entity.position = position;
        });
    }
};

module.exports = AggregationFilters;
