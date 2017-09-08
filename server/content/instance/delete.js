const Promise = require('bluebird');

const logger = require('./../../loggers');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;

    logger(req, "Trying to delete");

    console.log(`Request to delete ${domain}/${type}/${id}`);
    console.log('TODO: delete document');
    console.log('TODO: Log action');

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => {
                return Promise.resolve()
                    .then(() => entity.removeDocument(persistence, id))
                    .then(() => {
                        logger(req, "Deleted", instance);
                        res.status(204).send();
                    });
            },
            () => serverUtils.documentDoesNotExist(req, res)
        )
        .catch((err) => {
            logger(req, "Failed", {err});
            res.status(500).send(err.message); // FIXME: Don't send the err.
        })
        .finally(() => persistence.close());
};
