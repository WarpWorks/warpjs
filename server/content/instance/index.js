const deleteMethod = require('./delete');
const get = require('./get');
const patch = require('./patch');
const post = require('./post');

module.exports = {
    delete: deleteMethod,
    get,
    patch,
    post: (req, res) => post(req, res)
};
