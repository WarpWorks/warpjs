const _ = require('lodash');
const debug = require('debug')('W2:core:lib/doc-level/index');
const Promise = require('bluebird');

const constants = require('./constants');
const levelToString = require('./level-to-string');
const stringToLevel = require('./string-to-level');

function getEntityData(docLevel, persistence, entity, instance, tailLength) {
    if (tailLength && docLevel.length <= tailLength) {
        return {
            docLevel,
            model: entity,
            instance
        };
    }

    const first = docLevel.first();

    if (first) {
        const { key, value } = first;

        switch (key) {
            case constants.TYPES.BASIC:
                return Promise.resolve()
                    .then(() => entity.getBasicProperties().find((bp) => bp.name === value))
                    .then((model) => ({ model, instance }))
                ;

            case constants.TYPES.ENUMERATION:
                return Promise.resolve()
                    .then(() => entity.getEnums().find((anEnum) => anEnum.name === value))
                    .then((model) => ({ model, instance }))
                ;

            case constants.TYPES.RELATIONSHIP:
                return Promise.resolve()
                    .then(() => {
                        if (value === 'parentClass') {
                            return {
                                model: {
                                    addValue(persistence, type, id, instance) {
                                        instance.parentClass = parseInt(id, 10);
                                    }
                                },
                                instance
                            };
                        } else if (value === 'targetEntity') {
                            return {
                                model: {
                                    addValue(persistence, type, id, instance) {
                                        instance.targetEntity = parseInt(id, 10);
                                    }
                                },
                                instance
                            };
                        } else {
                            return Promise.resolve()
                                .then(() => entity.getRelationshipByName(value))
                                .then((relationship) => getRelationshipData(docLevel.remainder(), persistence, relationship, instance, tailLength));
                        }
                    })
                ;

            default:
                throw new Error(`TODO: Unknown entity implementation for key=${key} in docLevel=${docLevel.toString()}!`);
        }
    } else {
        // We are done.
        return {
            model: entity,
            instance
        };
    }
}

function getRelationshipData(docLevel, persistence, relationship, instance, tailLength) {
    if (tailLength && docLevel.length <= tailLength) {
        return {
            docLevel,
            model: relationship,
            instance
        };
    }

    const first = docLevel.first();

    if (first) {
        const { key, value } = first;

        switch (key) {
            case constants.TYPES.ENTITY:
                const targetEntity = relationship.getTargetEntity();

                switch (targetEntity.entityType) {
                    case 'Embedded': // FIXME: Use a constant.
                        return Promise.resolve()
                            .then(() => relationship.getTargetReferences(instance))
                            .then((relationships) => relationships.find((ref) => ref._id === value))
                            .then((reference) => getEntityData(docLevel.remainder(), persistence, targetEntity, reference, tailLength))
                        ;

                    default:
                        debug(`docLevel=${docLevel}; first=${key}:${value}`);
                        debug(`targetEntity=`, targetEntity);
                        throw new Error(`TODO: Unknown entityType implementation for ${targetEntity.entityType}!`);
                }

            default:
                throw new Error(`TODO: Implementation for key=${key}.`);
        }
    } else {
        return {
            model: relationship,
            instance
        };
    }
}

class DocLevel {
    constructor(docLevel) {
        if (docLevel) {
            this.docLevel = docLevel.split(constants.LEVEL_SEP).map((level) => stringToLevel(level));
        } else {
            this.docLevel = [];
        }
    }

    clone() {
        return new DocLevel(this.toString());
    }

    empty() {
        return new DocLevel();
    }

    first() {
        return (this.docLevel || [null])[0];
    }

    last() {
        return this.docLevel[this.docLevel.length - 1];
    }

    remainder() {
        const instance = new DocLevel();
        instance.docLevel = this.docLevel.slice(1);
        return instance;
    }

    // Adding new levels to the doc level.

    addBasic(value) {
        return this.increaseLevel(constants.TYPES.BASIC, value);
    }

    addEntity(value) {
        return this.increaseLevel(constants.TYPES.ENTITY, value);
    }

    addEnumeration(value) {
        return this.increaseLevel(constants.TYPES.ENUMERATION, value);
    }

    addRelationship(value) {
        return this.increaseLevel(constants.TYPES.RELATIONSHIP, value);
    }

    increaseLevel(key, value) {
        if (!_.isString(value)) {
            throw new Error(`Invalid value=${value} for key=${key} to add to ${this.toString()}!`);
        }

        const clone = this.clone();
        clone.docLevel.push({ key, value });
        return clone;
    }

    // Follow the doc level

    getData(persistence, entity, instance, tailLength) {
        return getEntityData(this, persistence, entity, instance, tailLength);
    }

    get length() {
        return this.docLevel.length;
    }

    // Conversions

    toString() {
        return this.docLevel.map((docLevel) => levelToString(docLevel)).join(constants.LEVEL_SEP);
    }

    static fromString(docLevel) {
        const instance = new DocLevel();
        instance.docLevel = docLevel.split(constants.LEVEL_SEP).map((level) => stringToLevel(level));
        return instance;
    }
}

module.exports = DocLevel;
