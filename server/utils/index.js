const config = require('./../config');
const warpCore = require('./../../lib/core');

function getPersistence(domain) {
    const Persistence = require(config.persistence.module);
    return new Persistence(config.persistence.host, domain || config.domainName);
}

function getDomain(domain) {
    return warpCore.getDomainByName(domain || config.domainName);
}

function getEntity(domain, type) {
    return getDomain(domain).getEntityByName(type);
}

function getRootEntity(domain) {
    return warpCore.getDomainByName(domain || config.domainName).getRootInstance();
}

function documentDoesNotExist(req, res) {
    res.status(404).send();
}

module.exports = {
    documentDoesNotExist,
    getDomain,
    getEntity,
    getPersistence,
    getRootEntity
};
