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

const app = express();

const buildDir = path.resolve(path.join(__dirname, '..', 'build'));

app.set('view engine', 'hbs');
app.set('views', './server/views');
app.set('sendfile-options', {root: buildDir});
app.set('public-folder', path.join(config.folders.iicData, 'public'));
// Make sure folder exists.
fs.lstatSync(app.get('public-folder'));

// Make sure to serve static assets first so we don't go in middlewares.
app.use('/static', express.static(buildDir));
app.use('/public', express.static(app.get('public-folder')));

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

app.use(routesInfo('/', '/').router);

app.use('/admin',
    // Authentication and authorization
    session.middlewares.requiresI3cUser,
    warpStudio.middlewares.canAccess.bind(null, 'i3cUser'),
    session.middlewares.unauthorized,
    // application
    warpStudio.app('/admin')
);

app.use('/content',
    warpJs.app('/content')
);

// DEBUG
const debug = require('debug')('I3C:Portal:app');
const RoutesInfo = require('@quoin/expressjs-routes-info');
debug("RoutesInfo.all()=", RoutesInfo.all());

module.exports = app;
