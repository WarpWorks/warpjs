#!/usr/bin/env node

const debug = require('debug')('W2:WarpJS');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const fileStreamRotator = require('file-stream-rotator');

const config = require('./server/config');

const port = normalizePort(process.env.PORT || config.port || 8080);

const server = express();

// Server log.
const logFolder = path.join(config.folders.w2projects, 'logs');
fs.existsSync(logFolder) || fs.mkdirSync(logFolder);
const accessLogStream = fileStreamRotator.getStream({
    filename: path.join(logFolder, 'access-%DATE%.log'),
    frequency: 'custom',
    verbose: false,
    date_format: 'YYYYMMDD'
});
server.use(morgan('combined', {stream: accessLogStream}));
// DEV is here just because i like to have a lot of output. I would not
// recommend the next line in a prod environment.
server.use(morgan('dev'));

const staticUrlPath = '/static';
server.use(staticUrlPath, express.static(path.join(__dirname, 'public')));

// --- BEGIN WARPJS ---
const app = require('./server/app');
server.use('/', app('/', staticUrlPath));
// --- END WARPJS ---

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
    debug(`Server started on port ${port}.`);
});
server.on('error', onError);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);

        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);

        default:
            throw error;
    }
}
