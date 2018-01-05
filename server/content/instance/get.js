const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../../../lib/change-logs');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

const config = serverUtils.getConfig();

function breadcrumbMapper(domain, breadcrumb) {
    const url = RoutesInfo.expand('W2:content:instance', {
        domain,
        type: breadcrumb.type,
        id: breadcrumb.id
    });
    const resource = warpjsUtils.createResource(url, breadcrumb);

    resource._links.self.title = breadcrumb.Name || breadcrumb.name || breadcrumb.type;

    return resource;
}

module.exports = (req, res) => {
    const {domain, type, id} = req.params;

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
    resource.link('sibling', RoutesInfo.expand('W2:content:instance-sibling', {
        domain,
        type,
        id
    }));
    resource.link('types', RoutesInfo.expand('W2:content:entities', {
        domain,
        profile: 'linkable'
    }));

    res.format({
        html() {
            const bundles = [
                `${RoutesInfo.expand('W2:app:static')}/libs/svg/svg.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/entity.js`
            ];

            utils.basicRender(bundles, resource, req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence(domain);

            return Promise.resolve()
                .then(() => serverUtils.getEntity(domain, type))
                .then((entity) => Promise.resolve()
                    .then(() => entity.getPageView(config.views.content))
                    .then((pageViewEntity) => Promise.resolve()
                        .then(() => entity.getInstance(persistence, id))
                        .then((instance) => {
                            resource.displayName = entity.getDisplayName(instance);
                            resource.isRootInstance = instance.isRootInstance;

                            resource.embed('changeLogs', ChangeLogs.toFormResource(domain, instance));

                            resource.link('history', RoutesInfo.expand('W2:content:instance-history', {
                                domain,
                                type,
                                id
                            }));

                            return Promise.resolve()
                                .then(() => serverUtils.canEdit(persistence, entity, instance, req.warpjsUser))
                                .then((canEdit) => {
                                    resource.canEdit = canEdit;
                                })
                                .then(() => entity.getInstancePath(persistence, instance))
                                .then((breadcrumbs) => breadcrumbs.map(breadcrumbMapper.bind(null, domain)))
                                .then((breadcrumbs) => {
                                    // FIXME: This should be embedded, and change
                                    // front-end code too.
                                    resource.breadcrumbs = breadcrumbs;
                                    // resource.embedded('breadcrumbs', breadcrumbs);
                                })
                                .then((relativeToDocument) => pageViewEntity.toFormResource(persistence, instance, [], {
                                    domain,
                                    type,
                                    id,
                                    href: resource._links.self.href
                                }))
                                .then((formResource) => {
                                    resource.formResource = formResource;
                                })
                            ;
                        })
                    )
                )
                .then(() => utils.sendHal(req, res, resource))
                .catch((err) => {
                    console.log("Error in GET: err=", err);
                    resource.error = true;
                    resource.message = err.message;
                    utils.sendHal(req, res, resource, 500);
                })
                .finally(() => persistence.close())
            ;
        }
    });
};
