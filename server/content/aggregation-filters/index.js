const addFilter = require('./add-filter');

module.exports = Object.freeze({
    post: async (req, res) => addFilter(req, res)
});
