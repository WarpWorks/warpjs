const get = require('./get');

module.exports = {
    get: async (req, res) => get(req, res)
};
