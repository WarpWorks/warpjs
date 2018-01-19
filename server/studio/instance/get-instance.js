const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const constants = require('./../constants');
const editionInstance = require('./../../edition/instance');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');
const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `WarpJS Studio: instance '${domain}/${type}/${id}'`,
        domain,
        type,
        id,
        canEdit: true // Admin can edit anything.
    });

    warpjsUtils.wrapWith406(res, {
        html: () => utils.basicRender(editionInstance.bundles, resource, req, res),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => utils.getInstance(persistence, type, id))
                .then((instanceData) => Promise.resolve()
                    .then(() => {
                        if (!instanceData || !instanceData.entity || !instanceData.instance) {
                            throw new Error(`Unable to find '${type}/${id}'.`);
                        }
                    })
                    .then(() => {
                        resource.displayName = instanceData.entity.getDisplayName(instanceData.instance);
                        resource.isRootInstance = Boolean(instanceData.instance.isRootInstance);
                    })

                    // Changelogs
                    .then(() => ChangeLogs.toFormResource(domain, instanceData.instance))
                    .then((changeLogs) => resource.embed('changeLogs', changeLogs))

                    // History
                    .then(() => RoutesInfo.expand(constants.routes.history, {
                        domain,
                        type,
                        id
                    }))
                    .then((historyUrl) => resource.link('history', historyUrl))

                    // Breadcrumbs
                    // TODO: How to find the whole path?
                    .then(() => RoutesInfo.expand(constants.routes.instance, { domain, type, id }))
                    .then((href) => warpjsUtils.createResource(href, {
                        type: instanceData.entity.name,
                        name: instanceData.instance.name
                    }))
                    .then((breadcrumbResource) => Promise.resolve()
                        .then(() => {
                            breadcrumbResource._links.self.title = instanceData.instance.name;
                        })
                        .then(() => resource.embed('breadcrumbs', breadcrumbResource))
                    )

                    // Get the form resource
                    .then(() => instanceData.entity.getPageView(config.views.content))
                    .then((pageView) => pageView.toStudioResource(persistence, instanceData.instance, [], {
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
