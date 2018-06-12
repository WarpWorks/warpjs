const generateDomainJson = require('./generate-domain-json');

module.exports = Object.freeze({
    get: (req, res) => generateDomainJson(req, res)
});
