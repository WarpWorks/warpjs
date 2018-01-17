const RoutesInfo = require('@quoin/expressjs-routes-info');

const constants = require('./constants');
const domain = require('./domain');
const domains = require('./domains');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(constants.routes.home, '/', domains);
    routesInfo.route(constants.routes.domain, '/{domain}', domain);
    routesInfo.route(constants.routes.entities, '/{domain}/type', {});
    routesInfo.route(constants.routes.entity, '/{domain}/type/{type}', {});

    return routesInfo;
};
