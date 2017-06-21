const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');
const warpJs = require('@warp-works/warpjs');
const warpStudio = require('@warp-works/studio');

const config = require('./config');
const routesInfo = require('./routes-info');
const session = require('./session');
const version = require('./version');

const app = express();

const buildDir = path.resolve(path.join(__dirname, '..', 'build'));

const PUBLIC_FOLDER_KEY = 'public-folder';
const PUBLIC_FOLDER_PATH_KEY = 'public-folder-path';

app.set('view engine', 'hbs');
app.set('views', './server/views');
app.set('sendfile-options', {root: buildDir});
app.set(PUBLIC_FOLDER_KEY, path.join(config.folders.iicData, 'public'));
app.set(PUBLIC_FOLDER_PATH_KEY, '/public');

// Make sure folder exists.
fs.lstatSync(app.get(PUBLIC_FOLDER_KEY));

// Make sure to serve static assets first so we don't go in middlewares.
app.use('/static', express.static(buildDir));
app.use(app.get(PUBLIC_FOLDER_PATH_KEY), express.static(app.get(PUBLIC_FOLDER_KEY)));

app.use(cookieParser(config.cookieSecret, {
    httpOnly: true,
    maxAge: 60 * 60, // 1 hour
    sameSite: true
}));
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session.middlewares.i3cUser);

app.use('/__version', version.routesInfo('/__version', '/').router);

app.use('/session', session.routesInfo('/session', '/').router);

app.use('/', session.middlewares.requiresI3cUser, routesInfo('/', '/').router);

app.use('/admin',
    // Authentication and authorization
    session.middlewares.requiresI3cUser,
    warpJs.middlewares.canAccessAsAdmin.bind(null, 'i3cUser'),
    session.middlewares.unauthorized,
    // application
    warpStudio.app('/admin')
);

app.use('/content',
    // Authentication and authorization
    session.middlewares.requiresI3cUser,
    warpJs.middlewares.canAccessAsContentManager.bind(null, 'i3cUser'),
    session.middlewares.unauthorized,
    warpJs.app('/content')
);

// DEBUG
const debug = require('debug')('I3C:Portal:app');
const RoutesInfo = require('@quoin/expressjs-routes-info');
debug("RoutesInfo.all()=", RoutesInfo.all());

module.exports = app;
