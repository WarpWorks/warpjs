const addAssociationToEmbedded = require('./add-association-to-embedded');
const getInstance = require('./get-instance');
const removeElement = require('./remove-element');
const updateInstance = require('./update-instance');

module.exports = {
    delete: (req, res) => removeElement(req, res),
    get: (req, res) => getInstance(req, res),
    patch: (req, res) => updateInstance(req, res),
    post: (req, res) => addAssociationToEmbedded(req, res)
};
