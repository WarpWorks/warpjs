const getDomainName = require('./get-domain-name');

module.exports = async (domainName) => {
    // Avoid cyclic dependency.
    const warpjsCore = require('./../../lib/core');
    return warpjsCore.getDomainByName(getDomainName(domainName));
};
