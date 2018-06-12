const RoutesInfo = require('@quoin/expressjs-routes-info');

const constants = require('./../constants');

module.exports = Object.freeze({
    get bundles() {
        return constants.baseBundles.concat([
            `${RoutesInfo.expand('W2:app:static')}/app/${constants.assets.instance}`
        ]);
    }
});
