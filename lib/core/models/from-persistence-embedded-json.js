const Promise = require('bluebird');

module.exports = (persistence, instance, embedded, parentRelnID, Model, prop) => Promise.resolve()
    .then(() => embedded.find((embed) => embed.parentRelnID === parentRelnID))
    .then((embed) => embed ? embed.entities : [])
    .then((entities) => Promise.map(
        entities,
        (json) => Model.instantiateFromPersistenceJSON(persistence, json, instance)
    ))
    .then((values) => {
        instance[prop] = values;
    })
    .catch((err) => {
        console.error(`Error for Model=${Model.name}: ${err.message}`);
        throw err;
    })
;
