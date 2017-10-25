const RoutesInfo = require('@quoin/expressjs-routes-info');

const page = require('./page');

module.exports = (subPath, prefix) => {
    const routesInfo = new RoutesInfo(subPath, prefix);

    routesInfo.route('entity', '/{type}/{id}', page);

    return routesInfo;
};
