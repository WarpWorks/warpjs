const Promise = require('bluebird');

const getDomain = require('./get-domain');

module.exports = (domainName) => Promise.resolve()
    .then(() => getDomain(domainName))
    .then((domain) => domain.getRootInstance())
;
