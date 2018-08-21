const extractData = require('./extract-data');

module.exports = Object.freeze({
    post: (req, res) => extractData(req, res)
});
