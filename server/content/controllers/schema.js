const warpCore = require('@warp-works/core');

const utils = require('./../utils');

function domain(req, res) {
    const domainName = req.params.domain;

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

    utils.sendHal(req, res, resource);
}

function type(req, res) {
    const domainName = req.params.domain;
    const typeName = req.params.type;

    const resource = utils.createResource(req, {
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

    utils.sendHal(req, res, resource);
}

module.exports = {
    domain,
    type
};
