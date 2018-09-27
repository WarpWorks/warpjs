const acceptCookies = require('./accept-cookies');

module.exports = Object.freeze({
    post: (req, res) => acceptCookies(req, res)
});
