const getInstance = require('./get-instance');
const updateInstance = require('./update-instance');

module.exports = {
    get: (req, res) => getInstance(req, res),
    patch: (req, res) => updateInstance(req, res)
};
