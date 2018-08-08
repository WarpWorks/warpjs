const RoutesInfo = require('@quoin/expressjs-routes-info');

const homepage = require('./homepage');
const instance = require('./instance');
const preview = require('./preview');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route('homepage', '/', homepage);
    routesInfo.route('entity', '/{type}/{id}{?view,style}', instance);
    routesInfo.route('W2:portal:preview', '/{type}/{id}/preview', preview);

    return routesInfo;
};
