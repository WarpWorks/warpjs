const RoutesInfo = require('@quoin/expressjs-routes-info');

const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

function common(req, res) {
    const resource = utils.createResource(req, {
        title: "WarpJS domain list",
        layout: '_appLayout'
    });

    warpCore.domainFiles().forEach((domain) => {
        resource.embed('domain', utils.createResource(RoutesInfo.expand('w2-app:app', {domain: domain.name, type: domain.name}), domain));
    });

    return resource;
}

module.exports = (req, res) => {
    res.format({
        html: () => {
            const resource = common(req, res);
            utils.basicRender('domain-list', resource, req, res);
        },

        [utils.HAL_CONTENT_TYPE]: () => {
            const resource = common(req, res);
            utils.sendHal(req, res, resource);
        }
    });
};
