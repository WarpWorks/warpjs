module.exports = (profile, entity) => {
    if (profile) {
        if (profile === 'linkable') {
            const contentId = entity.getDomain().getEntityByName('Content').id;
            return (
                (entity.entityType === 'Document') &&
                entity.getParentClass() &&
                (entity.getParentClass().id === contentId)
            );
        }
    }
    return true;
};
