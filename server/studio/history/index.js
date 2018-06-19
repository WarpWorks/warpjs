const getHistory = require('./get-history');

module.exports = Object.freeze({
    get: (req, res) => getHistory(req, res)
});
