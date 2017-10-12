const debug = require('debug')('W2:content:domains:domainMapper');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../../config');
const serverUtils = require('./../../utils');

module.exports = (domain) => {
    debug("domain", domain);

    const domainEntity = serverUtils.getDomain(domain.name);
    debug("domainEntity.isWarpjsSchema=", domainEntity.isWarpjsSchema);

    const domainURL = RoutesInfo.expand('W2:content:domain', {
        domain: domain.name
    });
    const resource = warpjsUtils.createResource(domainURL, domain);
    resource.isDefaultDomain = (domain.name === config.domainName) || undefined;
    resource.isWarpjsSchema = domainEntity.isWarpjsSchema || false;

    resource.link('domainTypes', {
        href: RoutesInfo.expand('W2:content:entities', {
            domain: domain.name
        }),
        title: "List of types"
    });

    return resource;
};
