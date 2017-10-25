const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../config');
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

function sendError(req, res, err) {
    console.log("sendError(): err=", err);
    const resource = warpjsUtils.createResource(req, {
        message: "Error during processing content.",
        Errmessage: err.message
    });
    warpjsUtils.sendHal(req, res, resource, RoutesInfo, 500);
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
