const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./../constants');

module.exports = (req, res, resource, status) => {
    resource.link('warpjsHome', RoutesInfo.expand(constants.routes.home, {}));

    warpjsUtils.sendHal(req, res, resource, RoutesInfo, status);
};
