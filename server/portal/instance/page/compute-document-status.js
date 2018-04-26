
module.exports = (statusConfig, persistence, entity, instance) => {
    // FIXME: Handle inheritance.
    return instance[statusConfig.property];
};
