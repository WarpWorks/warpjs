const ChangeLogs = require('@warp-works/warpjs-change-logs');
// const debug = require('debug')('W2:studio:instance/get-instance');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const breadcrumbMapper = require('./../../edition/instance/breadcrumb-mapper');
const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./../constants');
const contentRoutes = require('./../../content/constants').routes;
const DocLevel = require('./../../../lib/doc-level');
const editionInstance = require('./../../edition/instance');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');
const serverUtils = require('./../../utils');

const config = serverUtils.getConfig();

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `WarpJS Studio: Instance '${domain}/${type}/${id}'`,
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
        resource.link('preview', RoutesInfo.expand(contentRoutes.instances, { domain, type: domain }));
    }

    warpjsUtils.wrapWith406(res, {
        html: () => utils.basicRender(editionInstance.bundles, resource, req, res),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => utils.getInstance(persistence, type, id))
                .then(
                    (instanceData) => Promise.resolve()
                        .then(() => {
                            resource.displayName = instanceData.entity.getDisplayName(instanceData.instance);
                            resource.isRootInstance = Boolean(instanceData.instance.isRootInstance);

                            if (instanceData.entity.isDocument(instanceData.instance)) {
                                resource.link('content', {
                                    href: RoutesInfo.expand(contentRoutes.instances, {
                                        domain,
                                        type: instanceData.instance.name
                                    }),
                                    title: `Show instances of '${instanceData.instance.name}'.`
                                });
                            }
                        })

                        // Changelogs
                        .then(() => warpCore.getDomainByName(domain))
                        .then((domainEntity) => domainEntity.getEntityByName('User')) // FIXME: Hard-coded
                        .then((userEntity) => ChangeLogs.toFormResource(instanceData.instance, domain, persistence, constants.routes.instance, userEntity))
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
                    ,

                    // Document not found.
                    () => {
                        resource.notFound = true;
                        // FIXME: This doesn't work because the referrer to this
                        // JSON is the HTML (which is the same URL)
                        // if (req.headers.referer) {
                        //     resource.link('referrer', req.headers.referer);
                        // }
                    }
                )
                .then(() => utils.sendHal(req, res, resource))
                .catch((err) => utils.sendErrorHal(req, res, resource, err))
                .finally(() => persistence.close())
            )
    });
};
