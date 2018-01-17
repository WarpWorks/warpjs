const redirectToDomains = require('./redirect-to-domains');

module.exports = {
    get: (req, res) => redirectToDomains(req, res)
};
