const createRelationship = require('./create-relationship');
const removeRelationship = require('./remove-relationship');

module.exports = {
    delete: (req, res) => removeRelationship(req, res),
    post: (req, res) => createRelationship(req, res)
};
