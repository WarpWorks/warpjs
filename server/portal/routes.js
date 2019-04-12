const RoutesInfo = require('@quoin/expressjs-routes-info');

const acceptCookies = require('./accept-cookies');
const feedback = require('./feedback');
const followDocument = require('./follow-document');
const homepage = require('./homepage');
const instance = require('./instance');
const preview = require('./preview');
const routes = require('./../../lib/constants/routes');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(routes.portal.homepage, '/', homepage);
    routesInfo.route(routes.portal.entity, '/{type}/{id}{?view,style}', instance);
    routesInfo.route(routes.portal.follow, '/{type}/{id}/follow-document/{yesno}', followDocument);
    routesInfo.route(routes.portal.preview, '/{type}/{id}/preview', preview);
    routesInfo.route(routes.portal.feedback, '/feedback', feedback);
    routesInfo.route(routes.portal.acceptCookies, '/accept-cookies', acceptCookies);

    return routesInfo;
};
