const RoutesInfo = require('@quoin/expressjs-routes-info');

const utils = require('./../utils');

module.exports = (req, res) => {
    const type = req.params.type;
    const domain = req.params.domain;

    const resource = utils.createResource(req, {
        type,
        domain,
        title: 'test',
        layout: '_appLayout'
    });

    resource.link('crud', RoutesInfo.expand('w2-app:crud'));
    resource.link('home', RoutesInfo.expand('w2-app:app', resource));
    resource.link('domain', RoutesInfo.expand('w2-app:domain', resource));

    res.format({
        html: () => {
            utils.basicRender(`warpJSClient`, resource, req, res);
        },

        [utils.HAL_CONTENT_TYPE]: () => {
            utils.sendHal(req, res, resource);
        }
    });
};
