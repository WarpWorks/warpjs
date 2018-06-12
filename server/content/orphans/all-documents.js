const Promise = require('bluebird');

const nonAbstractOnly = require('./../../edition/utils/non-abstract-only');

module.exports = (persistence, domainModel) => Promise.resolve()
    .then(() => domainModel.getEntities().filter(nonAbstractOnly))
    .then((entities) => Promise.reduce(
        entities,
        (documents, entity) => Promise.resolve()
            .then(() => entity.getDocuments(persistence))
            .then((entityDocuments) => documents.concat(entityDocuments)),
        []
    ))
;
