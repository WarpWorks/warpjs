const RoutesInfo = require('@quoin/expressjs-routes-info');

const { routes } = require('./constants');
const entities = require('./entities');
const history = require('./history');
const home = require('./home');
const instance = require('./instance');
const orphans = require('./orphans');
const types = require('./types');
const relationship = require('./relationship');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(routes.home, '/', home);
    routesInfo.route(routes.orphans, '/{domain}/orphans', orphans);
    routesInfo.route(routes.entities, '/{domain}/entities{?profile}', entities);
    routesInfo.route(routes.types, '/{domain}/types{?profile}', types);
    routesInfo.route(routes.instances, '/{domain}/{type}{?profile}', {});
    routesInfo.route(routes.instance, '/{domain}/{type}/{id}', instance);
    routesInfo.route(routes.history, '/{domain}/{type}/{id}/history', history);
    routesInfo.route(routes.relationship, '/{domain}/{type}/{id}/relationship/{relationship}{?profile}', relationship);
    routesInfo.route(routes.relationshipPage, '/{domain}/{type}/{id}/relationship/{relationship}/{page}', {});

    return routesInfo;
};
