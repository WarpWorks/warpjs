const addRelationship = require('./add-relationship');

module.exports = Object.freeze({
    post: (req, res) => addRelationship(req, res)
});
