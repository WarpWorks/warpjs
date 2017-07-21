const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

function common(req, res) {
    const resource = warpjsUtils.createResource(req, {
        title: "WarpJS domain list",
        layout: '_appLayout'
    });

    warpCore.domainFiles().forEach((domain) => {
        resource.embed('domain', warpjsUtils.createResource(RoutesInfo.expand('w2-app:app', {domain: domain.name, type: domain.name}), domain));
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
            warpjsUtils.sendHal(req, res, resource);
        }
    });
};
