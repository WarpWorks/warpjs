const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = (domain) => {
    // Clicking on the info icon.
    const domainUrl = RoutesInfo.expand('W2:studio:domain', {
        domain: domain.name
    });

    const resource = warpjsUtils.createResource(domainUrl, {
        name: domain.name,
        desc: domain.desc,
        lastUpdated: domain.lastUpdated,
        isDefaultDomain: (domain.name === config.domainName) || false
    });

    // Clicking on the list icon.
    resource.link('domainTypes', {
        href: RoutesInfo.expand('W2:studio:entities', {
            domain: domain.name
        }),
        title: "List of types"
    });

    // Clicking on the domain name label.
    resource.link('label', {
        href: resource._links.self.href,
        title: resource._links.self.title
    });

    return resource;
};
