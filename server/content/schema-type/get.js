const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const serverUtils = require('./../../utils');
const utils = require('./../utils');

const config = serverUtils.getConfig();

module.exports = (req, res) => {
    const { domain, type } = req.params;

    res.format({
        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => serverUtils.getEntity(domain, type))
            .then((entity) => Promise.resolve()
                .then(() => serverUtils.getDomain(domain))
                .then((schema) => schema.getEntityByName(type))
                .then((entity) => entity.getPageView(config.views.content))
                .then((pageView) => pageView.toFormResource())
                .then((pageView) => {
                    const resource = warpjsUtils.createResource(req, {
                        title: `Schema ${domain}-${type}`,
                        name: entity.name
                    });

                    resource.pageView = pageView;
                    utils.sendHalOnly(req, res, resource);
                })
            )
    });
};
