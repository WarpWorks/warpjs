const RoutesInfo = require('@quoin/expressjs-routes-info');

const entityRoutesInfo = require('./entity').routesInfo;
const homepageRoutesInfo = require('./homepage').routesInfo;
const mapRoutesInfo = require('./map').routesInfo;
const session = require('./session');

// const adminRouter = require('./admin').router;

module.exports = (subPath, baseUrl) => {
    const routesInfo = new RoutesInfo(subPath, baseUrl);
    const prefix = `${baseUrl}/${subPath}`;

    routesInfo.use(homepageRoutesInfo('/', prefix));
    routesInfo.use(mapRoutesInfo('/map', prefix));
    routesInfo.use(entityRoutesInfo('/entity', prefix));
    routesInfo.use(session.routesInfo('/session', prefix));

    /// / TODO: Change this to use HeadStart
    // router.use(pathInfo(pathInfo.ADMIN), session.middlewares.requiresI3cUser.bind(null, []), adminRouter);
    // router.use(pathInfo(pathInfo.CONTENT), session.middlewares.requiresI3cUser.bind(null, []), adminRouter);

    return routesInfo;
};
