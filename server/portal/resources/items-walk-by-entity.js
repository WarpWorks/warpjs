const Promise = require('bluebird');

// const debug = require('./debug')('items-walk-by-entity');

const walk = async (persistence, entity, instance, relationshipNames) => {
    const nextRelationshipName = relationshipNames && relationshipNames.length ? relationshipNames[0] : null;
    const remainingRelationshipNames = nextRelationshipName ? relationshipNames.slice(1) : null;

    if (nextRelationshipName) {
        const relationship = entity ? entity.getRelationshipByName(nextRelationshipName) : null;
        const items = relationship ? await relationship.getDocuments(persistence, instance) : [];

        return Promise.reduce(
            items,
            async (accumulator, item) => {
                const items = await walk(persistence, relationship.getTargetEntity(), item, remainingRelationshipNames);
                const filteredItems = items.filter((item) => item);
                return accumulator.concat(filteredItems);
            },
            []
        );
    } else {
        return [{
            entity,
            instance
        }];
    }
};

module.exports = async (persistence, entity, instance, relationshipNames) => walk(persistence, entity, instance, relationshipNames);
