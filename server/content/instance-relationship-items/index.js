const addRelationship = require('./add-relationship');
const listItems = require('./list-items');

module.exports = Object.freeze({
    get: async (req, res) => listItems(req, res),
    post: (req, res) => addRelationship(req, res)
});
