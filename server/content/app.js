//
// Set up Express configuration
//

const debug = require('debug')('W2:App:app');
var express = require('express');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const config = require('./../config');
const routes = require('./routes');

const ROOT_DIR = path.dirname(require.resolve('./../../package.json'));
const VIEWS_DIR = path.join(ROOT_DIR, 'views');
const PARTIAL_DIR = path.join(config.projectPath, 'views');

module.exports = (baseUrl, staticUrlPath) => {
    var app = express();

    // view engine setup
    const viewFolders = [
        VIEWS_DIR,
        PARTIAL_DIR
    ];

    debug(`viewFolders=`, viewFolders);

    app.set('views', viewFolders);
    app.set('view engine', 'hbs');
    app.set('W2:content:baseUrl', baseUrl === '/' ? '' : baseUrl);
    app.set('static-url', staticUrlPath === '/' ? '' : staticUrlPath);

    app.use(favicon(path.join(ROOT_DIR, 'public', 'images', 'favicon.ico')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Public/static
    app.use(express.static(path.join(ROOT_DIR, 'public')));
    app.use('/assets', express.static(path.dirname(require.resolve('tinymce/tinymce.min.js'))));
    app.use('/domain-assets', express.static(path.join(config.projectPath, 'domains')));
    app.use(express.static(config.public));

    // Deal with Express / Handlebar Partials:
    hbsutils.registerPartials(VIEWS_DIR);
    hbsutils.registerWatchedPartials(PARTIAL_DIR);

    app.use(routes(baseUrl).router);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
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
        res.render('_error', {
            message: err.message,
            error: {}
        });
    });

    return app;
};
