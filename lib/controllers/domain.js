// const debug = require('debug')('W2:WarpJS:controllers:domain');
const warpCore = require('@warp-works/core');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const utils = require('./../utils');

module.exports = (req, res) => {
    const domainName = req.params.domain;
    /* TBD:
    if (req.accepts("html")) {
        const redirectURL = RoutesInfo.expand("w2-app:entity", { domain:domainName, type:domainName });
        res.redirect(redirectURL);
    }
    else {
    */
        const resource = utils.createResource(req, {
            domainName
        });

        try {
            const domainJSN = warpCore.getDomainByName(domainName);
            resource.domain = domainJSN.toJSON();
            resource.success = true;
        } catch (err) {
            // TODO: Log this error?
            resource.error = `Invalid domain name: '${domainName}'.`;
            resource.success = false;
        }

        // TODO: Currently only sending back JSON. Could send back HTML if requested
        // by wrapping inside of `res.format()`.
        utils.sendHal(req, res, resource);
    // }
};
