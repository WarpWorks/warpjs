const RoutesInfo = require('@quoin/expressjs-routes-info');

const utils = require('./../utils');

module.exports = (req, res) => {
    const type = req.params.type;

    const resource = utils.createResource(req, {
        type,
        title: 'test',
        layout: '_appLayout'
    });

    res.format({
        html: () => utils.basicRender(`app${type}`, resource, req, res),

        [utils.HAL_CONTENT_TYPE]: () => {
            resource.link('crud', RoutesInfo.expand('hs-app:crud'));
            resource.link('home', RoutesInfo.expand('hs-app:app', resource));
            utils.sendHal(req, res, resource);
        }
    });
};
