const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const breadcrumbMapper = require('./../../edition/instance/breadcrumb-mapper');
const ChangeLogs = require('./../../../lib/change-logs');
const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./../constants');
const contentConstants = require('./../../content/constants');
const DocLevel = require('./../../../lib/doc-level');
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

    resource.link('history', {
        href: RoutesInfo.expand(constants.routes.history, { domain, type, id }),
        title: "Entity history"
    });

    if (type === ComplexTypes.Domain) {
        resource.link('preview', RoutesInfo.expand(contentConstants.routes.instances, { domain, type: domain }));
    }

    warpjsUtils.wrapWith406(res, {
        html: () => utils.basicRender(editionInstance.bundles, resource, req, res),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => utils.getInstance(persistence, type, id))
                .then((instanceData) => Promise.resolve()
                    .then(() => {
                        resource.displayName = instanceData.entity.getDisplayName(instanceData.instance);
                        resource.isRootInstance = Boolean(instanceData.instance.isRootInstance);
                    })

                    // Changelogs
                    .then(() => ChangeLogs.toFormResource(domain, instanceData.instance))
                    .then((changeLogs) => resource.embed('changeLogs', changeLogs))

                    // Breadcrumbs
                    .then(() => instanceData.entity.getInstancePath(persistence, instanceData.instance))
                    .then((breadcrumbs) => breadcrumbs.map(
                        (breadcrumb) => breadcrumbMapper(domain, breadcrumb, constants.routes)
                    ))
                    .then((breadcrumbResource) => resource.embed('breadcrumbs', breadcrumbResource))

                    // Get the form resource
                    .then(() => instanceData.entity.getPageView(config.views.content))
                    .then((pageView) => pageView.toStudioResource(
                        persistence,
                        instanceData.instance,
                        new DocLevel(),
                        {
                            domain,
                            type,
                            id,
                            href: resource._links.self.href
                        },
                        constants.routes
                    ))
                    .then((formResource) => resource.embed('formResources', formResource))

                )
                .then(() => utils.sendHal(req, res, resource))
                .catch((err) => utils.sendErrorHal(req, res, resource, err))
                .finally(() => persistence.close())
            )
    });
};
