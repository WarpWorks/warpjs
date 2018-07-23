const extractInstance = require('./extract-instance');

module.exports = {
    get: (req, res) => extractInstance(req, res)
};
