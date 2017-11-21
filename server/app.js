const cookieParser = require('cookie-parser');
const debug = require('debug')('W2:WarpJS:app');
const express = require('express');
const path = require('path');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsPlugins = require('@warp-works/warpjs-plugins');
const warpStudio = require('@warp-works/studio');

const content = require('./content');
const extractAuthMiddlewares = require('./extract-auth-middlewares');
const portal = require('./portal');
const requestToken = require('./middlewares/request-token');
const serverUtils = require('./utils');
const status = require('./status');
const warpjsCore = require('./../lib/core');

module.exports = (baseUrl, staticUrl) => {
    const config = serverUtils.getConfig();

    const app = express();

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    app.set('base-url', baseUrl);
    app.set('static-url', staticUrl);

    RoutesInfo.staticPath('W2:app:public', app, baseUrl, '/public', path.join(config.folders.w2projects, 'public'));
    RoutesInfo.staticPath('W2:app:static', app, baseUrl, staticUrl, 'public');

    app.use(cookieParser(config.cookieSecret, {
        httpOnly: true,
        maxAge: 3 * 60 * 60, // 3 hours
        sameSite: true
    }));

    app.use(requestToken);

    warpjsPlugins.init(config.domainName, config.persistence, config.plugins);

    const authMiddlewares = extractAuthMiddlewares();

    if (authMiddlewares) {
        debug(`auth middlewares detected`);
        app.use(authMiddlewares.warpjsUser);
    }

    const adminPrefix = `${baseUrl}/admin`;
    const adminParams = [adminPrefix];

    const contentPrefix = `${baseUrl}/content`;
    const contentParams = [contentPrefix];

    const portalPrefix = `${baseUrl}/portal`;
    const portalParams = [portalPrefix];

    if (authMiddlewares) {
        adminParams.push(authMiddlewares.requiresWarpjsUser);
        adminParams.push(authMiddlewares.canAccessAsAdmin);
        adminParams.push(authMiddlewares.unauthorized);

        contentParams.push(authMiddlewares.requiresWarpjsUser);
        contentParams.push(authMiddlewares.canAccessAsContentManager);
        contentParams.push(authMiddlewares.unauthorized);

        portalParams.push(authMiddlewares.requiresWarpjsUser);
        portalParams.push(authMiddlewares.unauthorized);
    }

    adminParams.push(warpStudio.app(adminPrefix, staticUrl));
    app.use.apply(app, adminParams);

    contentParams.push(content.app(contentPrefix, staticUrl));
    app.use.apply(app, contentParams);

    portalParams.push(portal.app(portalPrefix, staticUrl));
    app.use.apply(app, portalParams);

    warpjsPlugins.register(warpjsCore, app, baseUrl, staticUrl);

    // Just send default to the portal.
    app.get('/', (req, res) => {
        res.redirect(RoutesInfo.expand('homepage'));
    });

    app.get('/_status', status);

    // --- DEBUG ---
    debug("RoutesInfo.all()=", require('lodash').map(RoutesInfo.all(), (route, key) => `${route.name} => ${route.pathname}`));
    // --- /DEBUG ---

    return app;
};
