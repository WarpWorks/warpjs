const RoutesInfo = require('@quoin/expressjs-routes-info');

const entityRoutesInfo = require('./entity').routesInfo;
const homepageRoutesInfo = require('./homepage').routesInfo;
const mapRoutesInfo = require('./map').routesInfo;

// const adminRouter = require('./admin').router;

module.exports = (subPath, baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.use(homepageRoutesInfo('/', baseUrl));
    routesInfo.use(mapRoutesInfo('/map', baseUrl));
    routesInfo.use(entityRoutesInfo('/entity', baseUrl));

    return routesInfo;
};
