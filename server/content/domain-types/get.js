// const debug = require('debug')('W2:WarpJS:controllers:domain');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const utils = require('./../utils');
const entityMap = require('./entity-map');
const linkableEntity = require('./linkable-entity');
const nonAbstractOnly = require('./non-abstract-only');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const profile = req.query.profile;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Types`
    });

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
            const schema = serverUtils.getDomain(domain);

            const entities = schema.getEntities()
                .filter(nonAbstractOnly)
                .filter((entity) => linkableEntity(profile, entity))
                .sort(warpjsUtils.byPositionThenName)
                .map((entity) => entityMap(domain, entity));

            resource.link('domain', {
                title: domain,
                href: RoutesInfo.expand('W2:content:domain', {
                    domain
                })
            });

            resource.embed('entities', entities);
            utils.sendHal(req, res, resource);
        }
    });
};
