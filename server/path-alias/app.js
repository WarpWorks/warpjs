const express = require('express');
const hbs = require('hbs');
const hbsUtils = require('hbs-utils')(hbs);

const warpjsUtils = require('@warp-works/warpjs-utils');

const routes = require('./routes');

module.exports = (baseUrl, staticUrlPath) => {
    const app = express();

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

    app.use(routes(baseUrl).router);

    return app;
};
