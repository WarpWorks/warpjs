const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = (domain) => {
    // Clicking on the info icon.
    const domainUrl = RoutesInfo.expand(constants.routes.instance, {
        domain: domain.name,
        type: domain.type,
        id: domain.id
    });

    const resource = warpjsUtils.createResource(domainUrl, {
        name: domain.name,
        desc: domain.desc,
        lastUpdated: domain.lastUpdated,
        isDefaultDomain: (domain.name === config.domainName) || false
    });

    // Clicking on the list icon.
    resource.link('domainTypes', {
        href: RoutesInfo.expand(constants.routes.entities, {
            domain: domain.name,
            type: domain.type,
            id: domain.id
        }),
        title: "List of types"
    });

    // Clicking on the domain name label.
    resource.link('label', {
        href: resource._links.self.href,
        title: resource._links.self.title
    });

    // json export
    resource.link('export', {
        href: RoutesInfo.expand(constants.routes.jsonExport, {
            domain: domain.name
        }),
        title: `Export JSON`
    });

    return resource;
};
