const entities = {};

module.exports = async (domainName, entityName) => {
    if (!entities[domainName]) {
        entities[domainName] = {};
    }
    if (!entities[domainName][entityName]) {
        const core = require('./../');
        const domain = await core.getDomainByName(domainName);
        entities[domainName][entityName] = domain.getEntityByName(entityName);
    }
    return entities[domainName][entityName];
};
