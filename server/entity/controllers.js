const config = require('./../config');
const Persistence = require('./../persistence');

function index(req, res) {
    // TODO: use HeadStart to find the root instance.
    const persistence = new Persistence(config.persistence.host, config.persistence.dbName);

    persistence.documents(config.persistence.dbName)
        .then((documents) => documents[0]) // TODO: Handle if not !== 1?
        .then((rootInstance) => {
        });
}

function entity(req, res) {
}

module.exports = {
    index,
    entity
};
