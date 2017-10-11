const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

const domain = require('./domain');
const domains = require('./domains');
const domainType = require('./domain-type');
const domainTypes = require('./domain-types');
const instances = require('./instances');
const instance = require('./instance');
const instanceHistory = require('./instance-history');
const instanceRelationship = require('./instance-relationship');
const entitySibling = require('./entity-sibling');
const home = require('./home');
// const schemaType = require('./schema-type');

const ROUTE_OPTIONS = {
    allowPatch: 'application/json'
};

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route('W2:content:home', '/', home);
    routesInfo.route('W2:content:domains', '/domain', domains);
    routesInfo.route('W2:content:domain', '/domain/{domain}', domain);
    routesInfo.route('W2:content:entities', '/domain/{domain}/type{?profile}', domainTypes);
    routesInfo.route('W2:content:entity', '/domain/{domain}/type/{type}{?profile}', domainType);
    routesInfo.route('W2:content:instances', '/domain/{domain}/type/{type}/instance', instances);
    routesInfo.route('W2:content:instance', '/domain/{domain}/type/{type}/instance/{id}', instance, ROUTE_OPTIONS);
    routesInfo.route('W2:content:instance-history', '/domain/{domain}/type/{type}/instance/{id}/history', instanceHistory);
    routesInfo.route('W2:content:instance-sibling', '/domain/{domain}/type/{type}/instance/{id}/sibling', entitySibling);
    routesInfo.route('W2:content:instance-relationship', '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}', instanceRelationship, ROUTE_OPTIONS);
    routesInfo.route('W2:content:instance-relationship-page', '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/page/{page}', instance);

    routesInfo.route('W2:content:schema-domain', '/schema/{domain}')
        .get(controllers.schema.domain);

    //     routesInfo.route('W2:content:crud', '/api/CRUD')
    //         .post(controllers.crud);

    return routesInfo;
};
