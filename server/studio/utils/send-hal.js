const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (req, res, resource, status) => {
    resource.link('warpjsHome', RoutesInfo.expand('W2:studio:home', {}));
    if (req.params.type) {
        resource.link('warpjsDomain', RoutesInfo.expand('W2:studio:domain', {
            domain: req.params.domain
        }));
    }

    warpjsUtils.sendHal(req, res, resource, RoutesInfo, status);
};
