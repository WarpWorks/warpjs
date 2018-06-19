const canEdit = require('./can-edit');
const documentDoesNotExist = require('./document-does-not-exist');
const getConfig = require('./get-config');
const getDomain = require('./get-domain');
const getEntity = require('./get-entity');
const getPersistence = require('./get-persistence');
const getRootEntity = require('./get-root-entity');
const sendError = require('./send-error');
const sendErrorHal = require('./send-error-hal');
const sendHal = require('./send-hal');

module.exports = Object.freeze({
    canEdit: (persistance, entity, instance, user) => canEdit(persistance, entity, instance, user),
    documentDoesNotExist: (req, res) => documentDoesNotExist(req, res),
    getConfig: () => getConfig(),
    getDomain: (domainName) => getDomain(domainName),
    getEntity: (domainName, type) => getEntity(domainName, type),
    getPersistence: (domainName) => getPersistence(domainName),
    getRootEntity: (domainName) => getRootEntity(domainName),
    sendError: (req, res, err) => sendError(req, res, err),
    sendHal: (req, res, resource, status) => sendHal(req, res, resource, status),
    sendErrorHal: (req, res, resource, err, status) => sendErrorHal(req, res, resource, err, status)
});
