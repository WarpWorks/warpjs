const findOrphans = require('./find-orphans');

module.exports = Object.freeze({
    get: (req, res) => findOrphans(req, res)
});
