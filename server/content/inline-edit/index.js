const extractData = require('./extract-data');
const updateData = require('./update-data');

module.exports = Object.freeze({
    post: (req, res) => extractData(req, res),
    patch: (req, res) => updateData(req, res)
});
