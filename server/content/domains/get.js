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
        html: () => {
            utils.basicRender(
                [
                    `${RoutesInfo.expand('W2:app:static')}/app/vendor.js`,
                    `${RoutesInfo.expand('W2:app:static')}/app/domains.js`
                ],
                resource, req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const domains = warpCore.domainFiles().map(domainMapper);
            resource.embed('domains', domains);

            utils.sendHal(req, res, resource);
        }
    });
};
