const RoutesInfo = require('@quoin/expressjs-routes-info');

const constants = require('./constants');
const domain = require('./domain');
const domains = require('./domains');
const domainType = require('./domain-type');
const domainTypes = require('./domain-types');
const entitySibling = require('./entity-sibling');
const home = require('./home');
const instances = require('./instances');
const instance = require('./instance');
const instanceHistory = require('./instance-history');
const instanceRelationship = require('./instance-relationship');
const orphans = require('./orphans');

const ROUTE_OPTIONS = {
    allowPatch: 'application/json'
};

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(constants.routes.home, '/', home);
    routesInfo.route(constants.routes.domains, '/domain', domains);
    routesInfo.route(constants.routes.domain, '/domain/{domain}', domain);
    routesInfo.route(constants.routes.orphans, '/domain/{domain}/orphans', orphans);
    routesInfo.route(constants.routes.entities, '/domain/{domain}/type{?profile}', domainTypes);
    routesInfo.route(constants.routes.entity, '/domain/{domain}/type/{type}{?profile}', domainType);
    routesInfo.route(constants.routes.instances, '/domain/{domain}/type/{type}/instance', instances);
    routesInfo.route(constants.routes.instance, '/domain/{domain}/type/{type}/instance/{id}', instance, ROUTE_OPTIONS);
    routesInfo.route(constants.routes.history, '/domain/{domain}/type/{type}/instance/{id}/history', instanceHistory);
    routesInfo.route(constants.routes.sibling, '/domain/{domain}/type/{type}/instance/{id}/sibling', entitySibling);
    routesInfo.route(constants.routes.relationship, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}', instanceRelationship, ROUTE_OPTIONS);
    routesInfo.route(constants.routes.relationshipPage, '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/page/{page}', instance);

    return routesInfo;
};
