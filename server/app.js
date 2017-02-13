const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');

const config = require('./config');
const homepageRouter = require('./homepage').router;
const mapRouter = require('./map').router;
const session = require('./session');

const app = express();

const buildDir = path.resolve(path.join(__dirname, '..', 'build'));

app.set('view engine', 'hbs');
app.set('views', './server/views');
app.set('sendfile-options', {root: buildDir});

// Make sure to serve static assets first so we don't go in middlewares.
app.use('/static', express.static(buildDir));

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

app.use('/', homepageRouter);
app.use('/session', session.router);
app.use('/map', mapRouter);

module.exports = app;
