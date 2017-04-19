const RoutesInfo = require('@quoin/expressjs-routes-info');

const entityRoutesInfo = require('./entity').routesInfo;
const homepageRoutesInfo = require('./homepage').routesInfo;
const mapRoutesInfo = require('./map').routesInfo;
const session = require('./session');

// const adminRouter = require('./admin').router;

module.exports = (subPath, baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.use(homepageRoutesInfo('/', baseUrl));
    routesInfo.use(mapRoutesInfo('/map', baseUrl));
    routesInfo.use(entityRoutesInfo('/entity', baseUrl));
    routesInfo.use(session.routesInfo('/session', baseUrl));

    /// / TODO: Change this to use HeadStart
    // router.use(pathInfo(pathInfo.ADMIN), session.middlewares.requiresI3cUser.bind(null, []), adminRouter);
    // router.use(pathInfo(pathInfo.CONTENT), session.middlewares.requiresI3cUser.bind(null, []), adminRouter);

    return routesInfo;
};
