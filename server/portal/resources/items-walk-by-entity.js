// const debug = require('debug')('W2:portal:resources/items-walk-by-entity');
const Promise = require('bluebird');

function walk(persistence, entity, instance, relationshipNames) {
    const nextRelationshipName = relationshipNames && relationshipNames.length ? relationshipNames[0] : null;
    const remainingRelationshipNames = nextRelationshipName ? relationshipNames.slice(1) : null;

    if (nextRelationshipName) {
        return Promise.resolve()
            .then(() => entity ? entity.getRelationshipByName(nextRelationshipName) : null)
            .then((relationship) => Promise.resolve()
                .then(() => relationship ? relationship.getDocuments(persistence, instance) : [])
                .then((items) => Promise.reduce(items,
                    (accumulator, item) => Promise.resolve()
                        .then(() => walk(persistence, relationship.getTargetEntity(), item, remainingRelationshipNames))
                        .then((items) => items.filter((item) => item))
                        .then((items) => accumulator.concat(items))
                    ,
                    []
                ))
            )
        ;
    } else {
        return [{
            entity,
            instance
        }];
    }
}

module.exports = (persistence, entity, instance, relationshipNames) => Promise.resolve()
    .then(() => walk(persistence, entity, instance, relationshipNames))
;
