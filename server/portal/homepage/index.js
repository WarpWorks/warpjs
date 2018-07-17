const redirectToDefaultPage = require('./redirect-to-default-page');

module.exports = {
    get: (req, res) => redirectToDefaultPage(req, res)
};
