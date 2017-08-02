const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../../config');
const utils = require('./../utils');
const warpCore = require('./../../../lib/core');

function common(req, res) {
    const resource = warpjsUtils.createResource(req, {
        title: "WarpJS domain list"
    });

    resource.link('w2WarpJSHome', RoutesInfo.expand('W2:content:home'));

    warpCore.domainFiles().forEach((domain) => {
        const domainURL = RoutesInfo.expand('W2:content:app', {
            domain: domain.name,
            type: domain.name
        });
        const domainResource = warpjsUtils.createResource(domainURL, domain);
        domainResource.isDefaultDomain = (domain.name === config.domainName);

        resource.embed('domain', domainResource);
    });

    return resource;
}

module.exports = (req, res) => {
    res.format({
        html: () => {
            const resource = common(req, res);
            utils.basicRender(
                [
                    `/content/app/vendor.js`,
                    `/content/app/domain-list.js`
                ],
                resource, req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            const resource = common(req, res);
            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        }
    });
};
