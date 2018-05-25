// const debug = require('debug')('W2:portal:instance/page/compute-document-status');
const Promise = require('bluebird');

function getParentStatus(statusConfig, persistence, entity, instance) {
    return Promise.resolve()
        .then(() => entity.getParentInstance(persistence, instance))
        .then((parentInstances) => parentInstances.pop())
        .then((parentInstance) => {
            if (parentInstance) {
                const parentStatus = parentInstance[statusConfig.property];

                if (parentStatus === statusConfig.inheritance) {
                    return Promise.resolve()
                        .then(() => entity.getParentEntity(instance))
                        .then((parentEntity) => getParentStatus(statusConfig, persistence, parentEntity, parentInstance))
                    ;
                } else {
                    return parentStatus;
                }
            }
        })
    ;
}

module.exports = (statusConfig, persistence, entity, instance) => {
    const instanceStatus = instance[statusConfig.property];

    return (instanceStatus === statusConfig.inheritance)
        ? getParentStatus(statusConfig, persistence, entity, instance)
        : instanceStatus
    ;
};
