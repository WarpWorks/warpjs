const Promise = require('bluebird');

const utils = require('./../utils');
const warpCore = require('./../../../lib/core');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../../config');

module.exports = (req, res) => {
    console.log("in schema-type.get()...");
    const domain = req.params.domain;
    const type = req.params.type;

    return Promise.resolve()
        .then(() => warpCore.getDomainByName(domain))
        .then((schema) => schema.getEntityByName(type))
        .then((entity) => {
            const resource = warpjsUtils.createResource(req, {
                name: entity.name,
                title: `Schema ${domain}-${type}`
            });

            return Promise.resolve(entity.getPageView(config.views.content))
                .then((pageView) => resource.pageView = pageView.toFormResource())
                .then(() => resource);
        })
        .then((resource) => utils.sendHalOnly(req, res, resource));
};
