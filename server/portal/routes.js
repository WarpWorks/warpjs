const RoutesInfo = require('@quoin/expressjs-routes-info');

const acceptCookies = require('./accept-cookies');
const alias = require('./alias');
const createNewVersion = require('./create-new-version');
const entityHtml = require('./entity-html');
const entityPdf = require('./entity-pdf');
const feedback = require('./feedback');
const followDocument = require('./follow-document');
const homepage = require('./homepage');
const instance = require('./instance');
const preview = require('./preview');
const routes = require('./../../lib/constants/routes');
const userProfileDocuments = require('./user-profile-documents');
const userProfileNotifications = require('./user-profile-notifications');

module.exports = (baseUrl) => {
    const routesInfo = new RoutesInfo('/', baseUrl);

    routesInfo.route(routes.portal.homepage, '/', homepage);
    routesInfo.route(routes.portal.acceptCookies, '/accept-cookies', acceptCookies);
    routesInfo.route(routes.portal.feedback, '/feedback', feedback);
    routesInfo.route(routes.portal.userProfileDocuments, '/user-profile/documents', userProfileDocuments);
    routesInfo.route(routes.portal.userProfileNotifications, '/user-profile/notifications', userProfileNotifications);
    routesInfo.route(routes.portal.entityPdf, '/{type}/{id}.pdf{?viewName,refresh}', entityPdf);
    routesInfo.route(routes.portal.entityHtml, '/{type}/{id}.html{?viewName}', entityHtml);
    routesInfo.route(routes.portal.alias, '/{type}/{id}/alias', alias);
    routesInfo.route(routes.portal.entity, '/{type}/{id}{?view,style}', instance);
    routesInfo.route(routes.portal.createNewVersion, '/{type}/{id}/new-version', createNewVersion);
    routesInfo.route(routes.portal.follow, '/{type}/{id}/follow-document/{yesno}', followDocument);
    routesInfo.route(routes.portal.preview, '/{type}/{id}/preview', preview);

    return routesInfo;
};
