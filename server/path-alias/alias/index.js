const redirectAlias = require('./redirect-alias');

module.exports = Object.freeze({
    get: (req, res) => redirectAlias(req, res)
});
