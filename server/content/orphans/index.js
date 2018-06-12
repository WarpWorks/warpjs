const listOrphans = require('./list-orphans');

module.exports = Object.freeze({
    get: (req, res) => listOrphans(req, res)
});
