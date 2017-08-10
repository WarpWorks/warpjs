const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../../config');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

function breadcrumbMapper(domain, breadcrumb) {
    const url = RoutesInfo.expand('W2:content:entity2', {
        domain,
        type: breadcrumb.type,
        id: breadcrumb.id
    });
    breadcrumb.shortHand = breadcrumb.Name || breadcrumb.name || breadcrumb.type;
    return warpjsUtils.createResource(url, breadcrumb);
}

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Type ${type} - Id ${id}`
    });

    res.format({
        html() {
            utils.basicRender(
                [
                    `${RoutesInfo.expand('W2:app:static')}/libs/svg/svg.js`,
                    `${RoutesInfo.expand('W2:app:static')}/app/WarpCMS.js`,
                    `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                    `${RoutesInfo.expand('W2:app:static')}/app/entity.js`
                ],
                resource,
                req,
                res
            );
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const Persistence = require(config.persistence.module);
            const persistence = new Persistence(config.persistence.host, domain);

            return Promise.resolve()
                .then(() => warpCore.getDomainByName(domain))
                .then((schema) => schema.getEntityByName(type))
                .then((entity) => {
                    return Promise.resolve()
                        .then(() => entity.getInstance(persistence, id))
                        .then((instance) => {
                            console.log("instance=", instance);

                            const instanceUrl = RoutesInfo.expand('W2:content:entity2', {
                                domain,
                                type: instance.type,
                                id: instance.id
                            });

                            instance.displayName = instance.Name || instance.name || `${instance.type}[${instance.id}]`;

                            const instanceResource = warpjsUtils.createResource(instanceUrl, instance);
                            instanceResource.link('schema', {
                                href: RoutesInfo.expand('W2:content:schema-type', {
                                    domain,
                                    type
                                })
                            });

                            resource.embed('instance', instanceResource);
                            return Promise.resolve()
                                .then(() => entity.getInstancePath(persistence, instance))
                                .then((breadcrumbs) => breadcrumbs.map(breadcrumbMapper.bind(null, domain)))
                                .then((breadcrumbs) => resource.embed('breadcrumbs', breadcrumbs))
                            ;
                        });
                })
                .then(() => {
                    // resource.embed('breadcrumbs', breadcrumbs);
                })
                .then(() => utils.sendHal(req, res, resource))
                .finally(() => {
                });
        }
    });
};
