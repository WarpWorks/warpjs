// const debug = require('debug')('W2:content:domains:domainMapper');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = (domain) => {
    const domainURL = RoutesInfo.expand('W2:content:domain', {
        domain: domain.name
    });
    const resource = warpjsUtils.createResource(domainURL, {
        name: domain.name,
        description: domain.description,
        lastUpdated: domain.lastUpdated,
        isDefaultDomain: (domain.name === config.domainName) || undefined
    });

    resource.link('domainTypes', {
        href: RoutesInfo.expand('W2:content:entities', {
            domain: domain.name
        }),
        title: "List of types"
    });

    return resource;
};
