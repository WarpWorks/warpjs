const getDomain = require('./get-domain');

module.exports = async (domainName, type) => {
    const domain = await getDomain(domainName);
    return domain.getEntityByName(type);
};
