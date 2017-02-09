const express = require('express');

const mapRouter = require('./map').router;

const app = express();

app.use('/map', mapRouter);

module.exports = app;
