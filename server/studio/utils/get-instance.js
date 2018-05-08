const Promise = require('bluebird');

const getEntity = require('./get-entity');

module.exports = (persistence, type, id) => Promise.resolve()
    .then(() => getEntity(persistence, type))
    .then((entity) => Promise.resolve()
        .then(() => entity.getDocuments(persistence, { _id: id }, true))
        .then((documents) => documents.pop())
        .then((instance) => {
            if (!instance) {
                throw new Error(`Unable to find '${type}/${id}'.`);
            }

            return {
                entity,
                instance
            };
        })
    )
;
