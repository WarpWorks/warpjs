const createRelationship = require('./create-relationship');
const removeRelationship = require('./remove-relationship');
const retrieveRelationshipInfo = require('./retrieve-relationship-info');

module.exports = {
    delete: async (req, res) => removeRelationship(req, res),
    get: async (req, res) => retrieveRelationshipInfo(req, res),
    post: async (req, res) => createRelationship(req, res)
};
