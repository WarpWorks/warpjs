const remove = require('./remove');
const updateField = require('./update-field');

module.exports = Object.freeze({
    delete: (req, res) => remove(req, res),
    patch: (req, res) => updateField(req, res)
});
