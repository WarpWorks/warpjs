const listEntities = require('./list-entities');

module.exports = {
    get: (req, res) => listEntities(req, res)
};
