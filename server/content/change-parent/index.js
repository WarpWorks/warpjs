const get = require('./get');

module.exports = Object.freeze({
    get: async (req, res) => get(req, res)
});
