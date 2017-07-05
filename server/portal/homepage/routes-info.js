const RoutesInfo = require('@quoin/expressjs-routes-info');

const controllers = require('./controllers');

module.exports = (subPath, prefix) => {
    const routesInfo = new RoutesInfo(subPath, prefix);

    routesInfo.route('homepage', '/')
        .get(controllers.index);

    return routesInfo;
};
