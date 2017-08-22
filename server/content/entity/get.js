const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../../config');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

function breadcrumbMapper(domain, breadcrumb) {
    const url = RoutesInfo.expand('W2:content:entity', {
        domain,
        type: breadcrumb.type,
        id: breadcrumb.id
    });
    const resource = warpjsUtils.createResource(url, breadcrumb);

    resource._links.self.title = breadcrumb.Name || breadcrumb.name || breadcrumb.type;

    return resource;
}

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

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
    resource.link('sibling', RoutesInfo.expand('W2:content:entity-sibling', {
        domain,
        type,
        id
    }));

    res.format({
        html() {
            const bundles = [
                `${RoutesInfo.expand('W2:app:static')}/libs/svg/svg.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/WarpCMS.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/entity.js`
            ];

            utils.basicRender(bundles, resource, req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const persistence = serverUtils.getPersistence(domain);
            const entity = serverUtils.getEntity(domain, type);
            const pageViewEntity = entity.getPageView(config.views.content);

            return Promise.resolve()
                .then(() => entity.getInstance(persistence, id))
                .then((instance) => {
                    resource.displayName = entity.getDisplayName(instance);
                    resource.isRootInstance = instance.isRootInstance;

                    return Promise.resolve()
                        .then(() => entity.getInstancePath(persistence, instance))
                        .then((breadcrumbs) => breadcrumbs.map(breadcrumbMapper.bind(null, domain)))
                        .then((breadcrumbs) => {
                            resource.breadcrumbs = breadcrumbs;
                        })
                        .then(() => pageViewEntity.toFormResource(persistence, instance, []))
                        .then((formResource) => {
                            resource.formResource = formResource;
                        });
                })
                .then(() => utils.sendHal(req, res, resource))
                .finally(() => persistence.close());
        }
    });
};
