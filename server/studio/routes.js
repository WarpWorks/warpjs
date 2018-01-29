const RoutesInfo = require('@quoin/expressjs-routes-info');

const constants = require('./constants');
const entities = require('./entities');
const home = require('./home');
const instance = require('./instance');
const types = require('./types');
const relationship = require('./relationship');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(constants.routes.home, '/', home);
    routesInfo.route(constants.routes.entities, '/{domain}/entities{?profile}', entities);
    routesInfo.route(constants.routes.types, '/{domain}/types{?profile}', types);
    routesInfo.route(constants.routes.instances, '/{domain}/{type}{?profile}', {});
    routesInfo.route(constants.routes.instance, '/{domain}/{type}/{id}', instance);
    routesInfo.route(constants.routes.history, '/{domain}/{type}/{id}/history', {});
    routesInfo.route(constants.routes.relationship, '/{domain}/{type}/{id}/relationship/{relationship}', relationship);
    routesInfo.route(constants.routes.relationshipPage, '/{domain}/{type}/{id}/relationship/{relationship}/{page}', {});

    return routesInfo;
};
