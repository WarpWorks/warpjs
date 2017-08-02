const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

function common(req, res) {
    const resource = warpjsUtils.createResource(req, {
        title: "WarpJS domain list",
        layout: '_contentLayout'
    });

    warpCore.domainFiles().forEach((domain) => {
        resource.embed('domain', warpjsUtils.createResource(RoutesInfo.expand('W2:content:app', {domain: domain.name, type: domain.name}), domain));
    });

    return resource;
}

module.exports = (req, res) => {
    res.format({
        html: () => {
            const resource = common(req, res);
            utils.basicRender('domain-list', resource, req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const resource = common(req, res);
            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        }
    });
};
