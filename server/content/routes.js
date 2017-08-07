const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

const domain = require('./domain');
const domains = require('./domains');
const domainType = require('./domain-type');
const domainTypes = require('./domain-types');
const entities = require('./entities');
const entity = require('./entity');
const home = require('./home');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route('W2:content:home', '/', home);
    routesInfo.route('W2:content:domains', '/domains', domains);
    routesInfo.route('W2:content:domain', '/domains/{domain}', domain);
    routesInfo.route('W2:content:domain-types', '/domains/{domain}/types', domainTypes);
    routesInfo.route('W2:content:domain-type', '/domains/{domain}/types/{type}', domainType);
    routesInfo.route('W2:content:entities', '/domains/{domain}/types/{type}/instances', entities);
    routesInfo.route('W2:content:entity2', '/domains/{domain}/types/{type}/instances/{id}', entity);

    routesInfo.route('W2:content:entity', '/entity/{domain}/{type}{?oid}')
        .get(controllers.app);

    routesInfo.route('W2:content:schema-domain', '/schema/{domain}')
        .get(controllers.schema.domain);

    routesInfo.route('W2:content:schema-type', '/schema/{domain}/{type}')
        .get(controllers.schema.type);

    routesInfo.route('W2:content:crud', '/api/CRUD')
        .post(controllers.crud);

    return routesInfo;
};
