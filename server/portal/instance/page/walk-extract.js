const Promise = require('bluebird');

function walkExtract(persistence, entity, instance, memo, relationshipPath) {
    if (relationshipPath.length) {
        return Promise.resolve()
            .then(() => entity.getRelationshipByName(relationshipPath[0]))
            .then((relationship) => Promise.resolve()
                .then(() => {
                    if (relationship) {
                        return Promise.resolve()
                            .then(() => relationship.getDocuments(persistence, instance))
                            .then((subInstances) => Promise.reduce(
                                subInstances,
                                (memo, subInstance) => walkExtract(persistence, relationship.getTargetEntity(), subInstance, memo, relationshipPath.slice(1)),
                                memo
                            ))
                        ;
                    } else {
                        // If not %Content
                        return memo;
                    }
                })
            )
        ;
    } else {
        return memo.concat(instance);
    }
}

module.exports = walkExtract;
