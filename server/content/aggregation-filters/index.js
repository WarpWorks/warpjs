const addFilter = require('./add-filter');
const patchFilter = require('./patch-filter');
const removeFilter = require('./remove-filter');

module.exports = Object.freeze({
    delete: async (req, res) => removeFilter(req, res),
    patch: async (req, res) => patchFilter(req, res),
    post: async (req, res) => addFilter(req, res)
});
