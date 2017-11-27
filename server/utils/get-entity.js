const getDomain = require('./get-domain');

module.exports = (domainName, type) => getDomain(domainName).getEntityByName(type);
