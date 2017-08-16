const logger = require('./../../loggers').get('W2:content:entity:patch');
const serverUtils = require('./../../utils');

module.exports = (req, res) => {
    const domain = req.params.domain;
    const type = req.params.type;
    const id = req.params.id;
    const payload = req.body;

    console.log("TODO: apply action");
    console.log("TODO: Log action");

    const persistence = serverUtils.getPersistence(domain);
    const entity = serverUtils.getEntity(domain, type);

    return Promise.resolve()
        .then(() => entity.getInstance(persistence, id))
        .then(
            (instance) => {
                return Promise.resolve()
                    .then(() => entity.patcher(payload.updatePath, 0, payload.updateValue))
                    .then((patcher) => {
                        const {oldValue, newInstance} = patcher(instance);
                        logger.info(`User '${req.warpjsUser}': Updating ${domain}/${type}/${id}`, { data: {
                            user: req.warpjsUser,
                            updatePath: payload.updatePath,
                            newValue: payload.updateValue,
                            oldValue
                        }});
                        return newInstance;
                    })
                    .then((newDoc) => {
                    })
                    .then(() => res.status(204).send())
                ;
            },
            (err) => {
                console.log("err=", err);
                res.status(404).send();
            }
        )
        .catch((err) => {
            console.log(`PATCH ${req.originalUrl}: ERROR=`, err);
            throw err;
        })
    ;
};
