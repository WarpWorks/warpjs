const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

const domains = require('./domains');
const domainTypes = require('./domain-types');
const home = require('./home');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route('W2:content:home', '/', home);
    routesInfo.route('W2:content:domains', '/domains', domains);
    routesInfo.route('W2:content:domain', '/domains/{domain}', domainTypes);

    routesInfo.route('W2:content:schema-domain', '/schema/{domain}')
        .get(controllers.schema.domain);

    routesInfo.route('W2:content:schema-type', '/schema/{domain}/{type}')
        .get(controllers.schema.type);

    routesInfo.route('W2:content:app', '/domains/{domain}/{type}{?oid}')
        .get(controllers.app);

    routesInfo.route('W2:content:entity', '/domains/{domain}/{type}/{id}')
        .get(controllers.entity);

    routesInfo.route('W2:content:crud', '/api/CRUD')
        .post(controllers.crud);

    return routesInfo;
};
