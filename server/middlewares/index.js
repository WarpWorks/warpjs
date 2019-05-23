const aliases = require('./aliases');
const error = require('./error');
const requestToken = require('./request-token');

module.exports = {
    aliases: (req, res, next) => aliases(req, res, next),
    error: (err, req, res, next) => error(err, req, res, next),
    requestToken: (req, res, next) => requestToken(req, res, next)
};
