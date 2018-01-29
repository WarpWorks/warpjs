const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../../../lib/core/complex-types');
const constants = require('./../constants');
const utils = require('./../utils');

// FIXME: We just hard-code the Complex Type here.

module.exports = (req, res) => {
    const { domain } = req.params;
    const { profile } = req.query;

    const resource = warpjsUtils.createResource(req, {
        title: `Domain ${domain} - Types`,
        domain
    });

    warpjsUtils.wrapWith406(res, {
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => RoutesInfo.expand(constants.routes.entities, {
                domain,
                profile
            }))
            .then((typeUrl) => warpjsUtils.createResource(typeUrl, {
                domain,
                type: ComplexTypes.Entity,
                name: ComplexTypes.Entity
            }))
            .then((entity) => {
                entity.link('instances', {
                    href: RoutesInfo.expand(constants.routes.entities, { domain, profile }),
                    title: `List of instances for ${ComplexTypes.Entity}`
                });
                return entity;
            })
            .then((entity) => resource.embed('entities', entity))
            .then(() => utils.sendHal(req, res, resource))
    });
};
