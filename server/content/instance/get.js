// const debug = require('debug')('W2:content:instance/get');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const constants = require('./../constants');
const editionInstance = require('./../../edition/instance');
const serverUtils = require('./../../utils');
const studioRoutes = require('./../../studio/constants').routes;
const utils = require('./../utils');

const config = serverUtils.getConfig();

function breadcrumbMapper(domain, breadcrumb) {
    const url = RoutesInfo.expand(constants.routes.instance, {
        domain,
        type: breadcrumb.type,
        id: breadcrumb.id
    });
    const resource = warpjsUtils.createResource(url, breadcrumb);

    resource._links.self.title = breadcrumb.Name || breadcrumb.name || breadcrumb.type;

    return resource;
}

module.exports = (req, res) => {
    const { domain, type, id } = req.params;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Type ${type} - Id ${id}`,
        domain,
        type,
        id,
        _meta: {
            editable: true
        }
    });

    resource.link('preview', RoutesInfo.expand('entity', {
        type,
        id
    }));
    resource.link('sibling', RoutesInfo.expand(constants.routes.sibling, {
        domain,
        type,
        id
    }));
    resource.link('types', RoutesInfo.expand(constants.routes.entities, {
        domain,
        profile: 'linkable'
    }));

    res.format({
        html: () => utils.basicRender(editionInstance.bundles, resource, req, res),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => serverUtils.getPersistence(domain))
            .then((persistence) => Promise.resolve()
                .then(() => serverUtils.getEntity(domain, type))
                .then((entity) => Promise.resolve()
                    .then(() => {
                        // FIXME: to studio only if admin.
                        resource.link('studio', {
                            href: RoutesInfo.expand(studioRoutes.instance, {
                                domain,
                                type: entity.type,
                                id: entity.persistenceId
                            }),
                            title: "Edit schema in Studio"
                        });
                    })

                    .then(() => entity.getInstance(persistence, id))
                    .then((instance) => Promise.resolve()
                        .then(() => {
                            resource.displayName = entity.getDisplayName(instance);
                            resource.isRootInstance = instance.isRootInstance;
                            resource.status = instance.Status;
                        })

                        // Changelogs
                        .then(() => ChangeLogs.toFormResource(domain, persistence, instance))
                        .then((changeLogs) => resource.embed('changeLogs', changeLogs))

                        // History link.
                        .then(() => RoutesInfo.expand(constants.routes.history, {
                            domain,
                            type,
                            id
                        }))
                        .then((historyUrl) => resource.link('history', historyUrl))

                        // can edit the page?
                        .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                        .then((canEdit) => {
                            resource.canEdit = canEdit;
                        })

                        // Breadcrumbs
                        .then(() => entity.getInstancePath(persistence, instance))
                        .then((breadcrumbs) => breadcrumbs.map(breadcrumbMapper.bind(null, domain)))
                        .then((breadcrumbs) => resource.embed('breadcrumbs', breadcrumbs))

                        // Get the form resource
                        .then(() => entity.getPageView(config.views.content))
                        .then((pageViewEntity) => pageViewEntity.toFormResource(persistence, instance, [], {
                            domain,
                            type,
                            id,
                            href: resource._links.self.href
                        }))
                        .then((formResource) => resource.embed('formResources', formResource))
                    )
                )
                .finally(() => persistence.close())
            )
            .then(() => utils.sendHal(req, res, resource))
            .catch((err) => {
                console.log("Error in GET: err=", err);
                resource.error = true;
                resource.message = err.message;
                utils.sendHal(req, res, resource, 500);
            })
    });
};
