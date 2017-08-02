const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route('W2:content:home', '/')
        .get(controllers.domainList);

    routesInfo.route('W2:content:domain', '/{domain}')
        .get(controllers.domain);

    routesInfo.route('W2:content:schema-domain', '/schema/{domain}')
        .get(controllers.schema.domain);

    routesInfo.route('W2:content:schema-type', '/schema/{domain}/{type}')
        .get(controllers.schema.type);

    routesInfo.route('W2:content:app', '/{domain}/{type}{?oid}')
        .get(controllers.app);

    routesInfo.route('W2:content:crud', '/api/CRUD')
        .post(controllers.crud);

    return routesInfo;
};
