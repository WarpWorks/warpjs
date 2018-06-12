// const debug = require('debug')('W2:content:domains:domainMapper');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./../constants');
const serverUtils = require('./../../utils');
const studioConstants = require('./../../studio/constants');

const config = serverUtils.getConfig();

module.exports = (domain) => {
    // Clicking on the info icon.
    const domainURL = RoutesInfo.expand(constants.routes.domain, {
        domain: domain.name
    });
    const resource = warpjsUtils.createResource(domainURL, {
        name: domain.name,
        desc: domain.desc,
        lastUpdated: domain.lastUpdated,
        isDefaultDomain: (domain.name === config.domainName) || undefined
    });

    // Clicking on the list icon.
    resource.link('domainTypes', {
        href: RoutesInfo.expand(constants.routes.entities, {
            domain: domain.name
        }),
        title: "List of types"
    });

    // Clicking on the pencil icon.
    // TODO: Only available for admin users.
    resource.link('studio', {
        href: RoutesInfo.expand(studioConstants.routes.instance, {
            domain: domain.name,
            type: ComplexTypes.Domain,
            id: domain.id
        }),
        title: "Edit in Studio"
    });

    resource.link('orphans', {
        href: RoutesInfo.expand(constants.routes.orphans, {
            domain: domain.name
        }),
        title: "Find orphan documents"
    });

    // Clicking on the domain name label.
    resource.link('label', {
        href: resource._links.domainTypes.href,
        title: resource._links.domainTypes.title
    });

    return resource;
};
