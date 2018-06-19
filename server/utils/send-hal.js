const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (req, res, resource, status) => warpjsUtils.sendHal(req, res, resource, RoutesInfo, status);
