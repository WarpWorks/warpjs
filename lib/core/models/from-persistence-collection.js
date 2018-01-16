const Promise = require('bluebird');

module.exports = (persistence, instance, Model, prop) => Promise.resolve()
    .then(() => Model.getPersistenceDocuments(persistence, instance.persistenceId))
    .then((documents) => Promise.map(
        documents,
        (document) => Model.instantiateFromPersistenceJSON(persistence, document, instance)
    ))
    .then((elements) => {
        instance[prop] = elements;
    })
    .catch((err) => {
        console.error(`Error extracting child documents for Model=${Model.name}: err=`, err);
        throw err;
    })
;
