const express = require('express');
const warpjsUtils = require('@warp-works/warpjs-utils');

const routes = require('./routes');

module.exports = (baseUrl, staticUrl) => {
    const app = express();

    app.set('view engine', 'hbs');
    app.set('views', warpjsUtils.getHandlebarsViewsDir());
    app.set('base-url', baseUrl === '/' ? '' : baseUrl);
    app.set('static-url', staticUrl === '/' ? '' : staticUrl);

    app.use(routes(baseUrl).router);

    return app;
};
