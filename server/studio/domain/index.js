const getDomain = require('./get-domain');

module.exports = {
    get: (req, res) => getDomain(req, res)
};
