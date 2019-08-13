const get = require('./list-aliases');
const patch = require('./rename-alias');
const post = require('./create-alias');

module.exports = Object.freeze({
    get,
    patch,
    post
});
