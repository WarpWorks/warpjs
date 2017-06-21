const _ = require('lodash');
const debug = require('debug')('W2:WarpJS:routes');
const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route('w2-app:home', '/')
        .get(controllers.domainList);

    routesInfo.route('w2-app:domain', '/app/{domain}')
        .get(controllers.domain);

    routesInfo.route('w2-app:schema-domain', '/app/schema/{domain}')
        .get(controllers.schema.domain);

    routesInfo.route('w2-app:schema-type', '/app/schema/{domain}/{type}')
        .get(controllers.schema.type);

    routesInfo.route('w2-app:app', '/app/{domain}/{type}{?oid}')
        .get(controllers.app);

    routesInfo.route('w2-app:portal', '/portal/{domain}')
        .get(controllers.portal);

    routesInfo.route('w2-app:crud', '/api/CRUD')
        .post(controllers.crud);

    debug("RoutesInfo.all()=", _.map(RoutesInfo.all(), (route, key) => route));

    return routesInfo;
};
