const RoutesInfo = require('@quoin/expressjs-routes-info');

const documentRoutes = require('./instance').routes;
const homepageRoutesInfo = require('./homepage').routesInfo;
const preview = require('./preview');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.use(homepageRoutesInfo('/', baseUrl));
    routesInfo.use(documentRoutes('/', baseUrl));
    routesInfo.route('W2:portal:preview', '/{type}/{id}/preview', preview);

    return routesInfo;
};
