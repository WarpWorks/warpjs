const RoutesInfo = require('@quoin/expressjs-routes-info');

const alias = require('./alias');
const routes = require('./../../lib/constants/routes');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(routes.pathAlias.path, '/{alias}', alias);

    return routesInfo;
};
