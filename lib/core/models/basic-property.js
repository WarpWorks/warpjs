const _ = require('lodash');
// const debug = require('debug')('W2:model:BasicProperty');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const encryption = require('./../encryption');
const BasicTypes = require('./../basic-types');
const ComplexTypes = require('./../complex-types');
const InputTypeByBasicType = require('./../input-type-by-basic-type');
const Property = require('./property');

const REPLACED_PASSWORD = '************';
const TYPE = ComplexTypes.BasicProperty;

class BasicProperty extends Property {
    constructor(entity, id, name, desc, propertyType) {
        super(TYPE, entity, id, name, desc);

        this.propertyType = propertyType;
        this.constraints = null;
        this.examples = null;

        switch (propertyType) {
            case BasicTypes.String:
                this.defaultValue = "'text'";
                break;
            case BasicTypes.Text:
                this.defaultValue = "'text'";
                break;
            case BasicTypes.Password:
                this.defaultValue = "'text'";
                break;
            case BasicTypes.Number:
                this.defaultValue = 0;
                break;
            case BasicTypes.Boolean:
                this.defaultValue = true;
                break;
            case BasicTypes.Date:
                this.defaultValue = '"' + (new Date()).toLocaleString() + '"';
                break;
            default:
                throw new Error("Invalid BasicType: " + propertyType);
        }
    }

    // eslint-disable-next-line camelcase
    getParent_Entity() {
        return this.parent;
    }

    newInstance() {
        return this.defaultValue;
    }

    getTestData() {
        var testData;

        switch (this.propertyType) {
            case BasicTypes.String:
            case BasicTypes.Text:
            case BasicTypes.Password:
                testData = ["Lorem", "Ipsum", "Dolor", "Amet", "Consetetur", "Sadipscing"];
                if (this.examples) {
                    testData = this.examples.split(",");
                }
                return testData[Math.floor(Math.random() * testData.length)];
            case BasicTypes.Number:
                return Math.floor(Math.random() * 1000);
            case BasicTypes.Boolean:
                return Math.random() * 100 < 50;
            case BasicTypes.Date:
                testData = ["2016/12/24", "1970/12/10", "2014/12/28", "2012/02/05", "1977/12/16"];
                return testData[Math.floor(Math.random() * testData.length)];
            default:
                throw new Error("Invalid BasicType: " + this.propertyType);
        }
    }

    toString() {
        return this.name + ":" + this.propertyType;
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
            defaultValue: this.defaultValue,
            constraints: this.constraints,
            examples: this.examples,
            propertyType: this.propertyType
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.defaultValue = json.defaultValue;
        this.constraints = json.constraints;
        this.examples = json.examples;
        this.propertyType = json.propertyType;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new BasicProperty(parent, json.id, json.name, json.desc, json.propertyType);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return _.extend({}, super.toFormResourceBase(), {
            defaultValue: this.defaultValue,
            constraints: this.constraints,
            examples: this.examples,
            propertyType: this.propertyType
        });
    }

    toFormResource(persistence, instance, docLevel) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                inputType: InputTypeByBasicType[this.propertyType],
                value: this.getValue(instance),
                docLevel: docLevel.join('.')
            })))
        ;
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        docLevel = docLevel.addBasic(this.name);

        // FIXME: InputTypeByBasicType is not good for boolean.

        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                inputType: InputTypeByBasicType[this.propertyType],
                value: this.getValue(instance),
                docLevel: docLevel.toString()
            })))
        ;
    }

    patch(updatePath, updatePathLevel, instance, newValue) {
        return Promise.resolve()
            .then(() => this.setValue(instance, newValue))
        ;
    }

    isPassword() {
        return (this.propertyType === BasicTypes.Password);
    }

    getValue(instance) {
        return this.isPassword() ? REPLACED_PASSWORD : instance[this.name];
    }

    setValue(instance, newValue) {
        if (this.isPassword()) {
            return Promise.resolve()
                .then(() => encryption.generate(newValue))
                .then((encrypted) => {
                    instance[this.name] = encrypted;
                })
                // Because it's a password, we don't want it to be logged.
                .then(() => ({
                    newValue: REPLACED_PASSWORD,
                    oldValue: REPLACED_PASSWORD
                }))
            ;
        } else {
            return Promise.resolve()
                .then(() => {
                    // FIXME: All newValue are string. Must convert to propertyType.
                    const oldValue = instance[this.name];
                    instance[this.name] = newValue;
                    return {
                        oldValue,
                        newValue
                    };
                })
            ;
        }
    }

    save(persistence, parentID) {
        return Promise.resolve()
            .then(() => super.save(persistence, parentID))
        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            id: this.persistenceId,
            defaultValue: this.defaultValue,
            examples: this.examples,
            constraints: this.constraints,
            propertyType: this.propertyType
        });

        return json;
    }

    static getPersistenceDocuments(persistence, parentID) {
        return Promise.resolve()
            .then(() => persistence.documents(TYPE, { parentID }, true))
        ;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.persistenceId = json.id;
                this.defaultValue = json.defaultValue;
                this.examples = json.examples;
                this.constraints = json.constraints;
                this.propertyType = json.propertyType;
            })
            .then(() => this)
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new BasicProperty(parent, json.warpjsId, json.name, json.desc, json.propertyType))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }
}

module.exports = BasicProperty;
