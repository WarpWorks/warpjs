const RoutesInfo = require('@quoin/expressjs-routes-info');

const { routes } = require('./../constants');
const { sendHal } = require('./../../utils');

module.exports = (req, res, resource, status) => {
    resource.link('warpjsHome', RoutesInfo.expand(routes.home, {}));
    sendHal(req, res, resource, status);
};
