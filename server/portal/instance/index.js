const get = require('./get');
const patch = require('./patch');

module.exports = {
    get: async (req, res) => get(req, res),
    patch: async (req, res) => patch(req, res)
};
