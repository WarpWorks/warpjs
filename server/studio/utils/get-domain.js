const Promise = require('bluebird');

const getDomains = require('./get-domains');

module.exports = (persistence, domainName) => Promise.resolve()
    .then(() => getDomains(persistence))
    .then((domainsInfo) => ({
        entity: domainsInfo.entity,
        instance: domainsInfo.instances.filter((instance) => instance.name === domainName).pop()
    }))
;
