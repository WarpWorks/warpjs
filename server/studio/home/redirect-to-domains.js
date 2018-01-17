const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

module.exports = (req, res) => {
    warpjsUtils.wrapWith406(res, {
        html: () => {
            const domainsUrl = RoutesInfo.expand('W2:studio:domains', {});
            res.redirect(domainsUrl);
        }
    });
};
