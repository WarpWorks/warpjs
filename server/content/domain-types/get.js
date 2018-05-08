// const debug = require('debug')('W2:WarpJS:controllers:domain');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');
const editionConstants = require('./../../edition/constants');
const entityMap = require('./entity-map');
const linkableEntity = require('./../../edition/utils/linkable-entity');
const nonAbstractOnly = require('./../../edition/utils/non-abstract-only');
const serverUtils = require('./../../utils');
const utils = require('./../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const profile = req.query.profile;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Types`,
        domain
    });

    res.format({
        html: () => utils.basicRender(
            [
                `${RoutesInfo.expand('W2:app:static')}/app/${editionConstants.assets.vendor}`,
                `${RoutesInfo.expand('W2:app:static')}/app/${editionConstants.assets.domainTypes}`
            ],
            resource,
            req,
            res
        ),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => resource.link('domain', {
                title: domain,
                href: RoutesInfo.expand(constants.routes.domain, {
                    domain
                })
            }))
            .then(() => serverUtils.getDomain(domain))
            .then((schema) => schema.getEntities()
                .filter(nonAbstractOnly)
                .filter((entity) => linkableEntity(profile, entity))
                .sort(warpjsUtils.byPositionThenName)
                .map((entity) => entityMap(domain, entity))
            )
            .then((entities) => resource.embed('entities', entities))
            .then(() => utils.sendHal(req, res, resource))
    });
};
