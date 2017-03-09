const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const fs = require('fs');
const path = require('path');

const config = require('./config');
const router = require('./router');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session.middlewares.i3cUser);

app.use(router);

module.exports = app;
