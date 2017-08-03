// const debug = require('debug')('W2:WarpJS:controllers:domain');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

function nonAbstractOnly(entity) {
    return !entity.isAbstract;
}

function entityMap(domain, entity) {
    const entityData = {
        domain,
        type: entity.name,
        isDefault: entity.isRootInstance || undefined
    };

    const entityUrl = RoutesInfo.expand('W2:content:entities', entityData);
    return warpjsUtils.createResource(entityUrl, entityData);
}

module.exports = (req, res) => {
    const domain = req.params.domain;
    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Types`
    });
    resource.link('w2WarpJSHome', RoutesInfo.expand('W2:content:home'));

    res.format({
        html: () => {
            utils.basicRender(
                [
                    `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                    `${RoutesInfo.expand('W2:app:static')}/app/domain-types.js`
                ],
                resource,
                req,
                res
            );
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const schema = warpCore.getDomainByName(domain);
            const entities = schema.getEntities()
                .filter(nonAbstractOnly)
                .map(entityMap.bind(null, domain));

            resource.link('w2WarpJSHome', RoutesInfo.expand('W2:content:home'));
            resource.link('w2WarpJSDomain', RoutesInfo.expand('W2:content:domain', {
                domain
            }));

            resource.link('domain', {
                title: domain,
                href: RoutesInfo.expand('W2:content:domain', {
                    domain
                })
            });

            resource.embed('entities', entities);
            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        }
    });
};
