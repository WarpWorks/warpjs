const remove = require('./remove');

module.exports = Object.freeze({
    delete: (req, res) => remove(req, res)
});
