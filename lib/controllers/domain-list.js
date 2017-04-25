const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpCore = require('@warp-works/core');

const utils = require('./../utils');

module.exports = (req, res) => {
    const resource = utils.createResource(req, {
        title: "WarpJS domain list",
        layout: '_appLayout'
    });

    warpCore.domainFiles().forEach((domain) => {
        console.log("domain=", domain);
        resource.embed('domain', utils.createResource(RoutesInfo.expand('w2-app:app', {type: domain.name}), domain));
    });

    res.format({
        html: () => {
            utils.basicRender('domain-list', resource, req, res);
        }
    });
};
