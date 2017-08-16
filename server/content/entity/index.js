const deleteMethod = require('./delete');
const get = require('./get');
const patch = require('./patch');

module.exports = {
    delete: deleteMethod,
    get,
    patch
};
