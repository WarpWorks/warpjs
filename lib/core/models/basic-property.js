const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const encryption = require('./../encryption');
const Base = require('./base');
const BasicTypes = require('./../basic-types');
const InputTypeByBasicType = require('./../input-type-by-basic-type');

const REPLACED_PASSWORD = '************';

const TYPE = 'BasicProperty';

class BasicProperty extends Base {
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
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            defaultValue: this.defaultValue,
            constraints: this.constraints,
            examples: this.examples,
            propertyType: this.propertyType
        };
    }

    toFormResource(persistence, instance, docLevel) {
        return Promise.resolve(warpjsUtils.createResource('', {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            defaultValue: this.defaultValue,
            constraints: this.constraints,
            examples: this.examples,
            propertyType: this.propertyType,
            inputType: InputTypeByBasicType[this.propertyType],
            value: this.getValue(instance),
            docLevel: docLevel.join('.')
        }));
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

    toPersistenceJSON() {
        return {
            type: TYPE,
            name: this.name,
            description: this.desc,
            defaultValue: this.defaultValue,
            examples: this.examples,
            propertyType: this.propertyType,

            warpjsId: this.id,
            id: this.persistenceId
        };
    }
}

module.exports = BasicProperty;
