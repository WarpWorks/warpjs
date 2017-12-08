const error = require('./error');
const requestToken = require('./request-token');

module.exports = {
    error: (err, req, res, next) => error(err, req, res, next),
    requestToken: (req, res, next) => requestToken(req, res, next)
};
