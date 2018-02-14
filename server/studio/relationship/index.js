const createRelationship = require('./create-relationship');
const removeRelationship = require('./remove-relationship');
const retrieveRelationshipInfo = require('./retrieve-relationship-info');

module.exports = {
    delete: (req, res) => removeRelationship(req, res),
    get: (req, res) => retrieveRelationshipInfo(req, res),
    post: (req, res) => createRelationship(req, res)
};
