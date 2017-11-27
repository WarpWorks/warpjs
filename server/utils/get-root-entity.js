const getDomain = require('./get-domain');

module.exports = (domainName) => getDomain(domainName).getRootInstance();
