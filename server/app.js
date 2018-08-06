const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debug = require('debug')('W2:WarpJS:app');
const express = require('express');
const expressBusboy = require('express-busboy');
const path = require('path');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsPlugins = require('@warp-works/warpjs-plugins');
const warpjsUtils = require('@warp-works/warpjs-utils');

const content = require('./content');
const extractAuthMiddlewares = require('./extract-auth-middlewares');
const favicon = require('serve-favicon');
const logFiles = require('./log-files');
const portal = require('./portal');
const middlewares = require('./middlewares');
const serverUtils = require('./utils');
const status = require('./status');
const studio = require('./studio');
const warpjsCore = require('./../lib/core');

const ROOT_DIR = path.dirname(require.resolve('./../package.json'));

module.exports = (baseUrl, staticUrl) => {
    const config = serverUtils.getConfig();
    warpjsUtils.cache.setConfig(config);

    const app = express();

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    app.set('base-url', baseUrl);
    app.set('static-url', staticUrl);

    const logFolder = path.join(config.folders.w2projects, 'logs');
    logFiles(app, logFolder);

    RoutesInfo.staticPath('W2:app:public', app, baseUrl, '/public', path.join(config.folders.w2projects, 'public'));
    RoutesInfo.staticPath('W2:app:static', app, baseUrl, staticUrl, 'public');

    app.use(favicon(path.join(ROOT_DIR, 'public', 'images', 'favicon.ico')));
    app.use(bodyParser.json());
    expressBusboy.extend(app, {
        upload: true,
        path: path.join(config.folders.w2projects, 'tmpFiles')
    });

    app.use(cookieParser(config.cookieSecret, {
        httpOnly: true,
        maxAge: 3 * 60 * 60, // 3 hours
        sameSite: true
    }));

    app.use(middlewares.requestToken);

    warpjsPlugins.init(config.domainName, config.persistence, config.plugins);

    const authMiddlewares = extractAuthMiddlewares();

    if (authMiddlewares) {
        debug(`auth middlewares detected`);
        app.use(authMiddlewares.warpjsUser);
    }

    const adminPrefix = `${baseUrl}/studio`;
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

    adminParams.push(studio.app(adminPrefix, staticUrl));
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

    app.use(middlewares.error);

    return app;
};
