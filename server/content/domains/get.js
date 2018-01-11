const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const domainMapper = require('./domain-mapper');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

module.exports = (req, res) => {
    const resource = warpjsUtils.createResource(req, {
        title: "WarpJS domain list"
    });

    res.format({
        html: () => utils.basicRender(
            [
                `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                `${RoutesInfo.expand('W2:app:static')}/app/domains.js`
            ],
            resource, req, res
        ),

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => Promise.resolve()
            .then(() => warpCore.getPersistence())
            .then((persistence) => Promise.resolve()
                .then(() => Promise.map(warpCore.listDomains(persistence), (domain) => domainMapper(domain)))
                .finally(() => persistence.close())
            )
            .then((domains) => resource.embed('domains', domains))
            .then(() => utils.sendHal(req, res, resource))
    });
};
