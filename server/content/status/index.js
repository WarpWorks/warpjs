const updateStatus = require('./update-status');

module.exports = Object.freeze({
    post: async (req, res) => updateStatus(req, res)
});
