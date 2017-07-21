const express = require('express');
const path = require('path');

const config = require('./config');
const content = require('./content');
const plugins = require('./plugins');
const portal = require('./portal');

module.exports = (baseUrl, staticUrl) => {
    const app = express();

    app.set('view engine', 'hbs');
    app.set('views', './server/views');

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    app.use(`${baseUrl}/public`, express.static(path.join(config.folders.w2projects, 'public')));

    app.use(`${baseUrl}/content`, content.app(`${baseUrl}/content`, staticUrl));
    app.use(`${baseUrl}/portal`, portal.app(`${baseUrl}/portal`, staticUrl));

    plugins.register(app, config, baseUrl, staticUrl);

    // --- DEBUG ---
    const _ = require('lodash');
    const debug = require('debug')('W2:app');
    const RoutesInfo = require('@quoin/expressjs-routes-info');
    debug("RoutesInfo.all()=", _.map(RoutesInfo.all(), (route, key) => `${route.name} => ${route.pathname}`));
    // --- /DEBUG ---

    return app;
};
