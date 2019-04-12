const updateFollow = require('./update-follow');

module.exports = Object.freeze({
    get: async (req, res) => updateFollow(req, res)
});
