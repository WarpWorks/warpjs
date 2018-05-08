const listEntity = require('./list-entity');

module.exports = {
    get: (req, res) => listEntity(req, res)
};
