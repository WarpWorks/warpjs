const RoutesInfo = require('@quoin/expressjs-routes-info');

const entityRoutesInfo = require('./entity').routesInfo;
const homepageRoutesInfo = require('./homepage').routesInfo;

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.use(homepageRoutesInfo('/', baseUrl));
    routesInfo.use(entityRoutesInfo('/', baseUrl));

    return routesInfo;
};
