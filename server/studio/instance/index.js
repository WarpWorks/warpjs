const getInstance = require('./get-instance');

module.exports = {
    get: (req, res) => getInstance(req, res)
};
