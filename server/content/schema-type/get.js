const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../../config');
const serverUtils = require('./../../utils');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const entity = serverUtils.getEntity(domain, type);

    const resource = warpjsUtils.createResource(req, {
        title: `Schema ${domain}-${type}`,
        name: entity.name
    });

    return Promise.resolve()
        .then(() => warpCore.getDomainByName(domain))
        .then((schema) => schema.getEntityByName(type))
        .then((entity) => entity.getPageView(config.views.content))
        .then((pageView) => pageView.toFormResource())
        .then((pageView) => {
            resource.pageView = pageView;
            utils.sendHalOnly(req, res, resource);
        });
};
