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

    const entityUrl = RoutesInfo.expand('W2:content:app', entityData);
    const resource = warpjsUtils.createResource(entityUrl, entityData);
    return resource;
}

module.exports = (req, res) => {
    const domainName = req.params.domain;
    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domainName} - Types`
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
            const domain = warpCore.getDomainByName(domainName);
            const entities = domain.getEntities()
                .filter(nonAbstractOnly)
                .map(entityMap.bind(null, domainName));

            resource.embed('entities', entities);
            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        }
    });
};
