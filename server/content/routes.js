const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

const domain = require('./domain');
const domains = require('./domains');
const domainType = require('./domain-type');
const domainTypes = require('./domain-types');
const entities = require('./entities');
const entity = require('./entity');
const entityRelationship = require('./entity-relationship');
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
    routesInfo.route('W2:content:domain-types', '/domain/{domain}/type', domainTypes);
    routesInfo.route('W2:content:domain-type', '/domain/{domain}/type/{type}', domainType);
    // routesInfo.route('W2:content:schema-type', '/domain/{domain}/type/{type}/schema', schemaType);
    routesInfo.route('W2:content:entities', '/domain/{domain}/type/{type}/instance', entities);
    routesInfo.route('W2:content:entity', '/domain/{domain}/type/{type}/instance/{id}', entity, ROUTE_OPTIONS);
    routesInfo.route('W2:content:entity-sibling', '/domain/{domain}/type/{type}/instance/{id}/sibling', entitySibling);
    routesInfo.route('W2:content:entity-relationship', '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}', entityRelationship);
    routesInfo.route('W2:content:entity-relationship-page', '/domain/{domain}/type/{type}/instance/{id}/relationship/{relationship}/page/{page}', entity);

    routesInfo.route('W2:content:schema-domain', '/schema/{domain}')
        .get(controllers.schema.domain);

    routesInfo.route('W2:content:crud', '/api/CRUD')
        .post(controllers.crud);

    return routesInfo;
};
