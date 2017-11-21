const Promise = require('bluebird');

const getIndexer = require('./get-indexer');

module.exports = (doc) => Promise.resolve()
    .then(() => getIndexer())
    .then((indexer) => indexer ? indexer.indexDocument(doc) : null)
;
