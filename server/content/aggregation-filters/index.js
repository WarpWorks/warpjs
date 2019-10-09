const addFilter = require('./add-filter');
const removeFilter = require('./remove-filter');

module.exports = Object.freeze({
    delete: async (req, res) => removeFilter(req, res),
    post: async (req, res) => addFilter(req, res)
});
