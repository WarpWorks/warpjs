const createRelationship = require('./create-relationship');

module.exports = {
    post: (req, res) => createRelationship(req, res)
};
