const express = require('express');

const rootRouter = require('./root').router;
const mapRouter = require('./map').router;

const app = express();

const path = require('path');

app.set('view engine', 'hbs');
app.use('/', rootRouter);
app.use('/map', mapRouter);
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static(path.join(__dirname, '..', 'node_modules')));

module.exports = app;
