const fileStreamRotator = require('file-stream-rotator');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

morgan.token('remote-user', (req, res) => (req.warpjsUser && req.warpjsUser.UserName) || undefined);
morgan.token('warpjs-error', (req, res) => req.warpjsError || '-');
morgan.token('warpjs-token', (req, res) => req.warpjsRequestToken || '-');

const BASIC_LOG_CHUNKS = [
    ':remote-addr',
    '-',
    ':remote-user',
    '[:date[clf]]',
    '":method :url HTTP/:http-version"',
    ':status',
    ':res[content-length]',
    '":referrer" ":user-agent"',
    '":warpjs-token"'
];

morgan.format('access-log', BASIC_LOG_CHUNKS.join(' '));
morgan.format('error-log', BASIC_LOG_CHUNKS.concat([ '":warpjs-error"' ]).join(' '));

function logStream(logFolder, name) {
    return fileStreamRotator.getStream({
        filename: path.join(logFolder, `${name}-%DATE%.log`),
        frequency: 'custom',
        verbose: false,
        date_format: 'YYYYMMDD'
    });
}

module.exports = (app, logFolder) => {
    fs.existsSync(logFolder) || fs.mkdirSync(logFolder);

    const accessLogStream = logStream(logFolder, 'access');
    app.use(morgan('access-log', {
        stream: accessLogStream
    }));

    const errorLogStream = logStream(logFolder, 'error');
    app.use(morgan('error-log', {
        skip: (req, res) => res.statusCode < 400,
        stream: errorLogStream
    }));
};
