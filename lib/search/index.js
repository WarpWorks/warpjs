const isConfigured = require('./is-configured');
const query = require('./query');
const upsert = require('./upsert');

module.exports = {
    isConfigured: () => isConfigured(),
    query: (keyword) => query(keyword),
    upsert: (doc) => upsert(doc)
};
