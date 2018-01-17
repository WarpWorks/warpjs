const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const constants = require('./../constants');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const { domain } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `WarpJS Studio: domain '${domain}'`,
        domain,
        canEdit: true // Admin can edit anything.
    });

    warpjsUtils.wrapWith406(res, {
        html: () => utils.basicRender(
            [
                `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/entity.js`
            ],
            resource, req, res
        ),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => utils.getDomain(persistence, domain))
                .then((domainInfo) => Promise.resolve()
                    .then(() => {
                        resource.displayName = domainInfo.entity.getDisplayName(domainInfo.instance);
                        resource.isRootInstance = Boolean(domainInfo.instance.isRootInstance);
                    })

                    // Changelogs
                    .then(() => ChangeLogs.toFormResource(domain, domainInfo.instance))
                    .then((changeLogs) => resource.embed('changeLogs', changeLogs))

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

                )
                .then(() => utils.sendHal(req, res, resource))
                .catch((err) => {
                    console.error("ERROR getDomain(): err=", err);
                    utils.sendErrorHal(req, res, resource, err);
                })
                .finally(() => persistence.close())
            )
    });
};
