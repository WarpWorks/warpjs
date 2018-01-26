const _ = require('lodash');
const Promise = require('bluebird');

const LEVEL_SEP = '.';
const KEY_VALUE_SEP = ':';
const TYPES = {
    BASIC: 'Basic',
    ENTITY: 'Entity',
    ENUMERATION: 'Enum',
    RELATIONSHIP: 'Relationship'
};

function increaseLevel(instance, key, value) {
    if (!_.isString(value)) {
        throw new Error(`Invalid value=${value} for key=${key} to add to ${instance.toString()}!`);
    }

    const clone = new DocLevel(instance.toString());
    const valueToAdd = { key, value };

    if (clone.docLevel.length) {
        clone.docLevel = clone.docLevel.concat(valueToAdd);
    } else {
        clone.docLevel = [valueToAdd];
    }
    return clone;
}

function levelToString(level) {
    return [ level.key, level.value ].join(KEY_VALUE_SEP);
}

function stringToLevel(string) {
    const tokens = string.split(KEY_VALUE_SEP);
    const key = tokens.shift();
    const value = tokens.join(KEY_VALUE_SEP);
    return { key, value };
}

function getEntityData(docLevel, persistence, entity, instance) {
    const first = docLevel.first();

    if (first) {
        const { key, value } = first;

        switch (key) {
            case TYPES.BASIC:
                return Promise.resolve()
                    .then(() => entity.getBasicProperties().find((bp) => bp.name === value))
                    .then((model) => ({ model, instance }))
                ;

            case TYPES.ENUMERATION:
                return Promise.resolve()
                    .then(() => entity.getEnums().find((anEnum) => anEnum.name === value))
                    .then((model) => ({ model, instance }))
                ;

            case TYPES.RELATIONSHIP:
                return Promise.resolve()
                    .then(() => entity.getRelationshipByName(value))
                    .then((relationship) => getRelationshiptData(docLevel.remainder(), persistence, relationship, instance))
                ;

            default:
                throw new Error(`TODO: Unknown entity implementation for key=${key}!`);
        }
    } else {
        // We are done.
        return {
            model: entity,
            instance
        };
    }
}

function getRelationshiptData(docLevel, persistence, relationship, instance) {
    const first = docLevel.first();

    if (first) {
        const { key, value } = first;

        switch (key) {
            case TYPES.ENTITY:
                const targetEntity = relationship.getTargetEntity();

                switch (targetEntity.entityType) {
                    case 'Embedded':
                        return Promise.resolve()
                            .then(() => relationship.getTargetReferences(instance))
                            .then((relationships) => relationships.find((ref) => ref._id === value))
                            .then((reference) => getEntityData(docLevel.remainder(), persistence, targetEntity, reference))
                        ;

                    default:
                        throw new Error(`TODO: Unknown entityType implementation for ${targetEntity.entityType}!`);
                }
        }
    } else {
        throw new Error(`FIXME: Missing info for relationship.`);
    }
}

class DocLevel {
    constructor(docLevel) {
        if (docLevel) {
            this.docLevel = docLevel.split(LEVEL_SEP).map((level) => stringToLevel(level));
        } else {
            this.docLevel = [];
        }
    }

    first() {
        return (this.docLevel || [null])[0];
    }

    remainder() {
        const instance = new DocLevel();
        instance.docLevel = this.docLevel.slice(1);
        return instance;
    }

    // Adding new levels to the doc level.

    addBasic(value) {
        return increaseLevel(this, TYPES.BASIC, value);
    }

    addEntity(value) {
        return increaseLevel(this, TYPES.ENTITY, value);
    }

    addEnumeration(value) {
        return increaseLevel(this, TYPES.ENUMERATION, value);
    }

    addRelationship(value) {
        return increaseLevel(this, TYPES.RELATIONSHIP, value);
    }

    // Follow the doc level

    getData(persistence, entity, instance) {
        return getEntityData(this, persistence, entity, instance);
    }

    // Conversions

    toString() {
        return this.docLevel.map((docLevel) => levelToString(docLevel)).join(LEVEL_SEP)
        ;
    }

    static fromString(docLevel) {
        const instance = new DocLevel();
        instance.docLevel = docLevel.split(LEVEL_SEP).map((level) => stringToLevel(level));
        return instance;
    }
}

module.exports = DocLevel;
