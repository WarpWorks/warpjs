const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debug = require('debug')('W2:WarpJS:app');
const express = require('express');
const expressBusboy = require('express-busboy');
const expressUserAgent = require('express-useragent');
const hbs = require('hbs');
const hbsUtils = require('hbs-utils')(hbs);
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
const pathAlias = require('./path-alias');
const robots = require('./robots');
const serverUtils = require('./utils');
const status = require('./status');
const studio = require('./studio');
const warpjsCore = require('./../lib/core');

const ROOT_DIR = path.dirname(require.resolve('./../package.json'));

module.exports = (baseUrl, staticUrl) => {
    const config = serverUtils.getConfig();
    warpjsUtils.cache.setConfig(config);

    const app = express();

    app.use(expressUserAgent.express());

    app.get('/robots.txt', robots);

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    app.set('base-url', baseUrl);
    app.set('static-url', staticUrl);

    app.set('view engine', 'hbs');
    app.set('views', warpjsUtils.getHandlebarsViewsDir());
    const handlebarsPartialsDir = warpjsUtils.getHandlebarsPartialsDir();
    hbsUtils.registerWatchedPartials(
        handlebarsPartialsDir,
        {
            precompile: true,
            name: (template) => {
                const newTemplateName = template.replace(/_/g, '-');
                return newTemplateName;
            }
        },
        () => {}
    );

    const logFolder = path.join(config.folders.w2projects, 'logs');
    logFiles(app, logFolder);

    RoutesInfo.staticPath('W2:app:public', app, baseUrl, '/public', path.join(config.folders.w2projects, 'public'));
    RoutesInfo.staticPath('W2:app:static', app, baseUrl, staticUrl, 'public');

    const coreStaticPath = path.join(path.dirname(require.resolve('@warp-works/warpjs-utils/package.json')), 'assets');

    RoutesInfo.staticPath('W2:app:core', app, baseUrl, '/core', coreStaticPath);

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

    app.use(middlewares.aliases);

    const adminPrefix = `${baseUrl}/studio`;
    const adminParams = [ adminPrefix ];

    const contentPrefix = `${baseUrl}/content`;
    const contentParams = [ contentPrefix ];

    if (authMiddlewares) {
        adminParams.push(authMiddlewares.requiresWarpjsUser);
        adminParams.push(authMiddlewares.canAccessAsAdmin);
        adminParams.push(authMiddlewares.unauthorized);

        contentParams.push(authMiddlewares.requiresWarpjsUser);
        contentParams.push(authMiddlewares.canAccessAsContentManager);
        contentParams.push(authMiddlewares.unauthorized);
    }

    adminParams.push(studio.app(adminPrefix, staticUrl));
    app.use.apply(app, adminParams);

    contentParams.push(content.app(contentPrefix, staticUrl));
    app.use.apply(app, contentParams);

    const portalPrefix = `${baseUrl}/portal`;
    app.use(portalPrefix, portal.app(portalPrefix, staticUrl));

    warpjsPlugins.register(warpjsCore, app, baseUrl, staticUrl);

    const pathAliasPrefix = `${baseUrl}/alias`;
    app.use(pathAliasPrefix, pathAlias.app(pathAliasPrefix, staticUrl));

    // Just send default to the portal.
    app.get('/', (req, res) => {
        res.redirect(RoutesInfo.expand('homepage'));
    });

    app.get('/_status', status);

    // --- DEBUG ---
    const map = require('lodash/map');
    debug("RoutesInfo.all()=", map(RoutesInfo.all(), (route, key) => `${route.name} => ${route.pathname}`));
    // --- /DEBUG ---

    app.use(middlewares.error);

    return app;
};
