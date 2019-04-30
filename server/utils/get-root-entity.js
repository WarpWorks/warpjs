const getDomain = require('./get-domain');

module.exports = async (domainName) => {
    const domain = await getDomain(domainName);
    return domain.getRootInstance();
};
