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
        const domainURL = RoutesInfo.expand('W2:content:domain', {
            domain: domain.name
        });
        const domainResource = warpjsUtils.createResource(domainURL, domain);
        domainResource.isDefaultDomain = (domain.name === config.domainName) || undefined;

        resource.embed('domain', domainResource);
    });

    return resource;
}

module.exports = (req, res) => {
    const resource = common(req, res);
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
            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        }
    });
};
