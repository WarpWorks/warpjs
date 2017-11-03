const config = require('./../config');
const sendError = require('./send-error');
const warpCore = require('./../../lib/core');

function getDomainName(domain) {
    return domain || config.domainName;
}

function getPersistence(domain) {
    const Persistence = require(config.persistence.module);
    return new Persistence(config.persistence.host, getDomainName(domain));
}

function getDomain(domain) {
    return warpCore.getDomainByName(getDomainName(domain));
}

function getEntity(domain, type) {
    return getDomain(getDomainName(domain)).getEntityByName(type);
}

function getRootEntity(domain) {
    return warpCore.getDomainByName(getDomainName(domain)).getRootInstance();
}

function documentDoesNotExist(req, res) {
    res.status(404).send();
}

function getConfig() {
    return config;
}

module.exports = {
    documentDoesNotExist,
    getConfig,
    getDomain,
    getEntity,
    getPersistence,
    getRootEntity,
    sendError
};
