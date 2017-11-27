const getConfig = require('./get-config');
const getDomainName = require('./get-domain-name');

module.exports = (domainName) => {
    const config = getConfig();
    const Persistence = require(config.persistence.module);
    return new Persistence(config.persistence.host, getDomainName(domainName));
};
