const post = require('./post');

module.exports = Object.freeze({
    post: async (req, res) => post(req, res)
});
