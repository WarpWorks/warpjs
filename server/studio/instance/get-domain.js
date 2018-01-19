const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const constants = require('./../constants');
const editionInstance = require('./../../edition/instance');
const toFormResource = require('./../form-resource');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');
const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `WarpJS Studio: domain '${domain}'`,
        domain,
        canEdit: true // Admin can edit anything.
    });

    warpjsUtils.wrapWith406(res, {
        html: () => utils.basicRender(editionInstance.bundles, resource, req, res),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => utils.getDomain(persistence, domain))
                .then((domainInfo) => Promise.resolve()
                    .then(() => {
                        if (!domainInfo || !domainInfo.entity || !domainInfo.instance) {
                            throw new Error(`Unable to find domain '${domain}'.`);
                        }
                    })
                    .then(() => {
                        resource.displayName = domainInfo.entity.getDisplayName(domainInfo.instance);
                        resource.isRootInstance = Boolean(domainInfo.instance.isRootInstance);
                    })

                    // Changelogs
                    .then(() => ChangeLogs.toFormResource(domain, domainInfo.instance))
                    .then((changeLogs) => resource.embed('changeLogs', changeLogs))

                    // History
                    .then(() => RoutesInfo.expand(constants.routes.history, {
                        domain
                    }))
                    .then((historyUrl) => resource.link('history', historyUrl))

                    // Breadcrumbs
                    // The domain is only one level
                    .then(() => RoutesInfo.expand(constants.routes.domain, { domain }))
                    .then((href) => warpjsUtils.createResource(href, {
                        type: domainInfo.entity.name,
                        name: domainInfo.instance.name
                    }))
                    .then((breadcrumbResource) => Promise.resolve()
                        .then(() => {
                            breadcrumbResource._links.self.title = domainInfo.instance.name;
                        })
                        .then(() => resource.embed('breadcrumbs', breadcrumbResource))
                    )

                    // Get the form resource
                    .then(() => domainInfo.entity.getPageView(config.views.content))
                    .then((pageView) => toFormResource(persistence, pageView, domainInfo.instance, [], {
                        domain,
                        href: resource._links.self.href
                    }))
                    .then((formResource) => resource.embed('formResources', formResource))

                )
                .then(() => utils.sendHal(req, res, resource))
                .catch((err) => utils.sendErrorHal(req, res, resource, err))
                .finally(() => persistence.close())
            )
    });
};
