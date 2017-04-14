const debug = require('debug')('W2:WarpJS:routes');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route('hs-app:app', '/app/{type}{?oid}')
        .get(controllers.app);

    routesInfo.route('hs-app:portal', '/portal/{domain}')
        .get(controllers.portal);

    routesInfo.route('hs-app:crud', '/api/CRUD')
        .post(controllers.crud);

    debug("RoutesInfo.all()=", RoutesInfo.all());

    return routesInfo;
};
