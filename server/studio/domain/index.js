const redirectToInstance = require('./redirect-to-instance');

module.exports = {
    get: (req, res) => redirectToInstance(req, res)
};
