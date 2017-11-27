const getConfig = require('./get-config');

const DEFAULT_DOMAIN_NAME = getConfig().domainName;

module.exports = (domainName) => domainName || DEFAULT_DOMAIN_NAME;
