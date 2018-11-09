const reorder = require('./reorder');

module.exports = Object.freeze({
    patch: (req, res) => reorder(req, res)
});
