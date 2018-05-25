const generateDomainJson = require('./generate-domain-json');

const implementations = {
    get: (req, res) => generateDomainJson(req, res)
};

Object.freeze(implementations);

module.exports = implementations;
