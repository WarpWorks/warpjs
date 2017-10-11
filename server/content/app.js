//
// Set up Express configuration
//

// const debug = require('debug')('W2:App:app');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const warpjsUtils = require('@warp-works/warpjs-utils');

const config = require('./../config');
const routes = require('./routes');

const ROOT_DIR = path.dirname(require.resolve('./../../package.json'));

module.exports = (baseUrl, staticUrlPath) => {
    const app = express();

    app.set('view engine', 'hbs');
    app.set('views', warpjsUtils.getHandlebarsViewsDir());
    app.set('W2:content:baseUrl', baseUrl === '/' ? '' : baseUrl);
    app.set('static-url', staticUrlPath === '/' ? '' : staticUrlPath);

    app.use(favicon(path.join(ROOT_DIR, 'public', 'images', 'favicon.ico')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Public/static
    app.use('/domain-assets', express.static(path.join(config.projectPath, 'domains')));
    app.use(express.static(config.public));

    app.use(routes(baseUrl).router);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // // development error handler
    // // will print stacktrace
    // if (app.get('env') === 'development') {
    //     app.use(function(err, req, res, next) {
    //         res.status(err.status || 500);
    //         res.render('_error', {
    //             message: err.message,
    //             error: err
    //         });
    //     });
    // }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error-content', {
            message: err.message,
            error: {}
        });
    });

    return app;
};
