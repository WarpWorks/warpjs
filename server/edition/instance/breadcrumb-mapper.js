const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

/**
 *  Create a resource for a breadcrumb.
 *
 *  @param {string} domain - Domain name.
 *  @param {object} breadcrumb - Breadcrumb info.
 *  @param {object} routes - Routes object with a key `instance`.
 */

module.exports = (domain, breadcrumb, routes) => {
    const href = RoutesInfo.expand(routes.instance, {
        domain,
        type: breadcrumb.type,
        id: breadcrumb.id
    });

    const resource = warpjsUtils.createResource(href, breadcrumb);

    resource._links.self.title = breadcrumb.Name || breadcrumb.name || breadcrumb.type;

    return resource;
};
