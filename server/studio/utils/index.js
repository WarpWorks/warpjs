const getDomains = require('./get-domains');
const getEntity = require('./get-entity');
const getInstance = require('./get-instance');
const contentUtils = require('./../../content/utils');
const sendErrorHal = require('./send-error-hal');
const sendHal = require('./send-hal');

module.exports = {
    basicRender: (bundles, data, req, res) => contentUtils.basicRender(bundles, data, req, res, true),
    getEntity: (persistence, type) => getEntity(persistence, type),
    getDomains: (persistence) => getDomains(persistence),
    getInstance: (persistence, type, id) => getInstance(persistence, type, id),
    sendErrorHal: (req, res, resource, err, status) => sendErrorHal(req, res, resource, err, status),
    sendHal: (req, res, resource, status) => sendHal(req, res, resource, status)
};
