const express = require('express');

const mapRouter = require('./map').router;

const app = express();

const fs = require('fs');

const path = require('path');

app.set('view engine', 'hbs');
app.use('/map', mapRouter);
// app.use(express.static(path.join(__dirname, '..', 'client')));
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.static(path.join(__dirname, '..', 'node_modules')));


module.exports = app;
