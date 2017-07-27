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
        layout: '_appLayout'
    });

    resource.link('crud', RoutesInfo.expand('w2-app:crud'));
    resource.link('home', RoutesInfo.expand('w2-app:app', resource));
    resource.link('domain', RoutesInfo.expand('w2-app:domain', resource));
    resource.link('schemaDomain', RoutesInfo.expand('w2-app:schema-domain', resource));
    resource.link('schemaType', RoutesInfo.expand('w2-app:schema-type', resource));

    res.format({
        html: () => {
            utils.basicRender(`warpJSClient`, resource, req, res);
        },

        [warpjsUtils.constants.HAL_CONTENT_TYPE]: () => {
            warpjsUtils.sendHal(req, res, resource, RoutesInfo);
        }
    });
};
