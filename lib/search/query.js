const Promise = require('bluebird');

const getIndexer = require('./get-indexer');

module.exports = (keyword) => Promise.resolve()
    .then(() => getIndexer())
    .then((indexer) => indexer ? indexer.query(keyword) : null)
;
