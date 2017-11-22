const indexDocument = require('./index-document');
const isConfigured = require('./is-configured');
const query = require('./query');

module.exports = {
    isConfigured: () => isConfigured(),
    query: (keyword) => query(keyword),
    indexDocument: (persistence, entity, doc) => indexDocument(persistence, entity, doc)
};
