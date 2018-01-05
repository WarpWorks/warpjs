const Promise = require('bluebird');

const getDomain = require('./get-domain');

module.exports = (domainName, type) => Promise.resolve()
    .then(() => getDomain(domainName))
    .then((domain) => domain.getEntityByName(type))
;
