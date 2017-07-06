const express = require('express');
const path = require('path');

const content = require('./content');
const portal = require('./portal');

module.exports = (baseUrl, staticUrl, w2projectsPath) => {
    const app = express();

    baseUrl = (baseUrl === '/') ? '' : baseUrl;

    app.use(`${baseUrl}/public`, express.static(path.join(w2projectsPath, 'public')));

    app.use(`${baseUrl}/content`, content.app(`${baseUrl}/content`, staticUrl));
    app.use(`${baseUrl}/portal`, portal.app(`${baseUrl}/portal`, staticUrl));

    // --- DEBUG ---
    // const _ = require('lodash');
    // const debug = require('debug')('W2:app');
    // const RoutesInfo = require('@quoin/expressjs-routes-info');
    // debug("RoutesInfo.all()=", _.map(RoutesInfo.all(), (route, key) => `${route.name} => ${route.pathname}`));
    // --- /DEBUG ---

    return app;
};
