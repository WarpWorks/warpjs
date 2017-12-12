const first = require('./first');
const next = require('./next');

let walk; // require() below to avoid cyclic.

function ensureInstanceEmbedded(instance) {
    if (!instance.embedded) {
        instance.embedded = [];
    }
}

module.exports = (docLevel, entity, instance, relationshipName) => {
    const relationship = entity.getRelationshipByName(relationshipName);
    const target = relationship.getTargetEntity();
    ensureInstanceEmbedded(instance);

    if (target.isDocument()) {
        if (!instance.associations) {
            instance.associations = [];
        }

        let association = instance.associations.filter((association) => association.relnID === relationship.id).pop();

        if (!association) {
            association = {
                relnID: relationship.id,
                relnName: relationship.name, // FIXME: DEBUG ONLY
                data: []
            };

            instance.associations.push(association);
        }

        return association;
    } else {
        let embedded = instance.embedded.filter((embedded) => embedded.parentRelnID === relationship.id).pop();
        if (!embedded) {
            embedded = {
                parentRelnID: relationship.id,
                parentRelnName: relationship.name, // FIXME: DEBUG ONLY
                entities: []
            };

            instance.embedded.push(embedded);
        }

        if (!embedded.entities) {
            embedded.entities = [];
        }

        const firstLevel = first(docLevel);
        const filtered = embedded.entities.filter((entity) => entity._id === firstLevel.value).pop();

        if (!filtered) {
            throw new Error(`Cannot find element '${firstLevel.type}:${firstLevel.value}'.`);
        }

        if (!walk) {
            // NOTE: This to avoid cyclic.
            walk = require('./walk');
        }

        return walk(next(docLevel), target, filtered);
    }
};
