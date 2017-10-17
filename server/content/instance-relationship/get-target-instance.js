const Promise = require('bluebird');

module.exports = (req, persistence, instance, relationshipEntity) => {
    return Promise.resolve()
        .then(() => relationshipEntity.getDocuments(persistence, instance))
        .then((targetInstances) => targetInstances.filter((targetInstance) =>
            String(targetInstance.id) === req.body.id && targetInstance.type === req.body.type
        ))
        .then((targetInstances) => targetInstances.pop())
    ;
};
