#!/usr/bin/env node

const debug = require('debug')('W2:WarpJS');
const express = require('express');
const path = require('path');
const Promise = require('bluebird');

const config = require('./server/config');

Promise.config({
    longStackTraces: true
});

const port = normalizePort(process.env.PORT || config.port || 8080);

const server = express();

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
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
