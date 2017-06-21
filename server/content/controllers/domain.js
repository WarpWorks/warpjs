// const debug = require('debug')('W2:WarpJS:controllers:domain');
const RoutesInfo = require('@quoin/expressjs-routes-info');

module.exports = (req, res) => {
    const domainName = req.params.domain;
    const redirectURL = RoutesInfo.expand("w2-app:app", { domain: domainName, type: domainName });
    res.redirect(redirectURL);
};
