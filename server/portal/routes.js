const RoutesInfo = require('@quoin/expressjs-routes-info');

const documentRoutes = require('./instance').routes;
const homepageRoutesInfo = require('./homepage').routesInfo;

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.use(homepageRoutesInfo('/', baseUrl));
    routesInfo.use(documentRoutes('/', baseUrl));

    return routesInfo;
};
