const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const warpCore = require('./../../../lib/core');

function domain(req, res) {
    const domainName = req.params.domain;

    const resource = warpjsUtils.createResource(req, {
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

    warpjsUtils.sendHal(req, res, resource, RoutesInfo);
}

function type(req, res) {
    const domainName = req.params.domain;
    const typeName = req.params.type;

    const resource = warpjsUtils.createResource(req, {
        domainName,
        typeName
    });

    try {
        const domainJSN = warpCore.getDomainByName(domainName);
        const typeJSN = domainJSN.getEntityByName(typeName);
        resource.type = typeJSN.toJSON();
        resource.success = true;
    } catch (err) {
        resource.error = `Invalid type name: '${domainName}/${typeName}'.`;
        resource.success = false;
    }

    warpjsUtils.sendHal(req, res, resource, RoutesInfo);
}

module.exports = {
    domain,
    type
};
