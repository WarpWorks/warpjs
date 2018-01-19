const listDomains = require('./list-domains');

module.exports = {
    get: (req, res) => listDomains(req, res)
};
