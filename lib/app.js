//
// Set up Express configuration
//

var express = require('express');
var hbs = require('hbs');
var hbsutils = require('hbs-utils')(hbs);
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const config = require('./config');
const routes = require('./routes');

const ROOT_DIR = path.dirname(require.resolve('./../package.json'));
const VIEWS_DIR = path.join(ROOT_DIR, 'views');

module.exports = (baseUrl) => {
    var app = express();

    // view engine setup
    app.set('views', VIEWS_DIR);
    app.set('view engine', 'hbs');
    app.set('w2-app:baseUrl', baseUrl === '/' ? '' : baseUrl);

    app.use(favicon(path.join(ROOT_DIR, 'public', 'images', 'favicon.ico')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // Public/static
    app.use(express.static(path.join(ROOT_DIR, 'public')));
    app.use(express.static(path.join(ROOT_DIR, config.public)));

    // Deal with Express / Handlebar Partials:
    hbsutils.registerWatchedPartials(VIEWS_DIR);

    app.use(baseUrl, routes(baseUrl).router);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('_error', {
                message: err.message,
                error: err
            });
        });
    }

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
