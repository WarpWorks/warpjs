const express = require('express');
const path = require('path');

const homepageRouter = require('./homepage').router;
const mapRouter = require('./map').router;

const app = express();

const buildDir = path.resolve(path.join(__dirname, '..', 'build'));

app.set('view engine', 'hbs');
app.set('sendfile-options', {root: buildDir});

app.use('/', homepageRouter);
app.use('/map', mapRouter);
app.use('/static', express.static(buildDir));

module.exports = app;
