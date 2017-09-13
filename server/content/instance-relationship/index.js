const deleteMethod = require('./delete');
const patch = require('./patch');
const post = require('./post');

module.exports = {
    delete: deleteMethod,
    patch,
    post
};
