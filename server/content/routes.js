const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route('w2-app:home', '/')
        .get(controllers.domainList);

    routesInfo.route('w2-app:domain', '/{domain}')
        .get(controllers.domain);

    routesInfo.route('w2-app:schema-domain', '/schema/{domain}')
        .get(controllers.schema.domain);

    routesInfo.route('w2-app:schema-type', '/schema/{domain}/{type}')
        .get(controllers.schema.type);

    routesInfo.route('w2-app:app', '/{domain}/{type}{?oid}')
        .get(controllers.app);

    routesInfo.route('w2-app:crud', '/api/CRUD')
        .post(controllers.crud);

    return routesInfo;
};
