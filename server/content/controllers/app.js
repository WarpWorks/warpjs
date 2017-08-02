const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const utils = require('./../utils');

module.exports = (req, res) => {
    const type = req.params.type;
    const domain = req.params.domain;

    const resource = warpjsUtils.createResource(req, {
        type,
        domain,
        title: 'test',
        layout: '_contentLayout'
    });

    resource.link('crud', RoutesInfo.expand('W2:content:crud'));
    resource.link('home', RoutesInfo.expand('W2:content:app', resource));
    resource.link('domain', RoutesInfo.expand('W2:content:domain', resource));
    resource.link('schemaDomain', RoutesInfo.expand('W2:content:schema-domain', resource));
    resource.link('schemaType', RoutesInfo.expand('W2:content:schema-type', resource));

    res.format({
        html: () => {
            utils.basicRender(`warpJSClient`, resource, req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        }
    });
};
