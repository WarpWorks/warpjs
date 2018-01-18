const RoutesInfo = require('@quoin/expressjs-routes-info');

const constants = require('./../constants');

module.exports = {
    get bundles() {
        return [
            `${RoutesInfo.expand('W2:app:static')}/libs/svg/svg.js`,
            `${RoutesInfo.expand('W2:app:static')}/app/${constants.assets.vendor}`,
            `${RoutesInfo.expand('W2:app:static')}/app/${constants.assets.instance}`
        ];
    },

};
