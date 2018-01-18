const getDomain = require('./get-domain');
const getDomains = require('./get-domains');
const contentUtils = require('./../../content/utils');
const sendErrorHal = require('./send-error-hal');
const sendHal = require('./send-hal');

module.exports = {
    basicRender: (bundles, data, req, res) => contentUtils.basicRender(bundles, data, req, res, true),
    getDomain: (persistence, domainName) => getDomain(persistence, domainName),
    getDomains: (persistence) => getDomains(persistence),
    sendErrorHal: (req, res, resource, err, status) => sendErrorHal(req, res, resource, err, status),
    sendHal: (req, res, resource, status) => sendHal(req, res, resource, status)
};
