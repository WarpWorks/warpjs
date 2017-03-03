const config = require('./../config');
const Persistence = require('./../persistence');
const utils = require('./../utils');

function index(req, res) {
    utils.wrapWith406(res, {
        html: () => utils.sendIndex(res, 'Entity', 'entity')
    });
}

function entity(req, res) {
    utils.wrapWith406(res, {
        html: () => utils.sendIndex(res, 'Entity', 'entity'),

        [utils.HAL_CONTENT_TYPE]: () => {
            // TODO: use HeadStart to find the root instance.
            const persistence = new Persistence(config.persistence.host, config.persistence.dbName);

            persistence.documents(config.persistence.dbName)
                .then((documents) => documents[0]) // TODO: Handle if not !== 1?
                .then((rootInstance) => {
                    const resource = utils.createResource(req, {
                        hello: 'world'
                    });

                    utils.sendHal(req, res, resource);
                });
        }
    });
}

module.exports = {
    index,
    entity
};
