const Promise = require('bluebird');

// const createJsonAndIndex = require('./create-json-and-index');
const search = require('./../../../lib/search');

module.exports = (persistence, entity, instance) => Promise.resolve()
    .then(() => search.isConfigured())
    // .then((isConfigured) => isConfigured ? createJsonAndIndex(persistence, entity, instance) : null)
    .then((doc) => search.upsert(doc))
;
