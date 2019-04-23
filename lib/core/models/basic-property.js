const extend = require('lodash/extend');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

// const debug = require('./debug')('basic-property');
const encryption = require('./../encryption');
const BasicTypes = require('./../basic-types');
const ComplexTypes = require('./../complex-types');
const InputTypeByBasicType = require('./../input-type-by-basic-type');
const Property = require('./property');
const routes = require('./../../constants/routes');

const REPLACED_PASSWORD = '************';
const TYPE = ComplexTypes.BasicProperty;

class BasicProperty extends Property {
    constructor(entity, id, name, desc, propertyType) {
        super(TYPE, entity, id, name, desc);

        this.propertyType = propertyType || BasicTypes.String;
        this.constraints = null;
        this.examples = null;
        this.defaultValue = BasicTypes.defaultValue(this.propertyType);
    }

    // eslint-disable-next-line camelcase
    getParent_Entity() {
        return this.parent;
    }

    newInstance() {
        return this.defaultValue;
    }

    toString() {
        return `${this.name}@${this.id}:${this.propertyType}`;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
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
        return extend({}, super.toFormResourceBase(), {
            defaultValue: this.defaultValue,
            constraints: this.constraints,
            examples: this.examples,
            propertyType: this.propertyType,
            propertyTypeCheck: BasicTypes.typesCheck(this.propertyType)
        });
    }

    toFormResource(persistence, instance, docLevel) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            inputType: InputTypeByBasicType[this.propertyType],
            value: this.getValue(instance),
            docLevel: docLevel.join('.')
        }));

        if (this.propertyType === BasicTypes.File) {
            resource.link('upload', {
                href: RoutesInfo.expand(routes.content.fileUpload, {
                    domain: this.getDomain().name
                }),
                title: "Upload a new file"
            });
        }
        return resource;
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        let href = '';

        if (instance.id) {
            docLevel = docLevel.empty().addBasic(this.name);

            href = RoutesInfo.expand(routes.instance, {
                domain: relativeToDocument.domain,
                type: instance.type,
                id: instance.id
            });

            relativeToDocument = {
                domain: relativeToDocument.domain,
                type: instance.type,
                id: instance.id,
                href
            };
        } else {
            docLevel = docLevel.addBasic(this.name);
            href = relativeToDocument.href;
        }

        // FIXME: InputTypeByBasicType is not good for boolean.

        return warpjsUtils.createResource(href, extend({}, this.toFormResourceBase(), {
            inputType: InputTypeByBasicType[this.propertyType],
            value: this.getValue(instance),
            docLevel: docLevel.toString()
        }));
    }

    async patch(updatePath, updatePathLevel, instance, newValue) {
        return this.setValue(instance, newValue);
    }

    isPassword() {
        return (this.propertyType === BasicTypes.Password);
    }

    getValue(instance) {
        return this.isPassword() ? REPLACED_PASSWORD : instance[this.name];
    }

    async setValue(instance, newValue) {
        if (this.isPassword()) {
            const encrypted = await encryption.generate(newValue);
            instance[this.name] = encrypted;

            // Because it's a password, we don't want it to be logged.
            return {
                newValue: REPLACED_PASSWORD,
                oldValue: REPLACED_PASSWORD
            };
        } else {
            if (this.name === 'name') {
                newValue = newValue.replace(/\W/g, '');
            }

            // FIXME: All newValue are string. Must convert to propertyType.
            const oldValue = instance[this.name];
            instance[this.name] = newValue;

            return { oldValue, newValue };
        }
    }

    async save(persistence, parentID) {
        return super.save(persistence, parentID);
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            id: this.persistenceId,
            defaultValue: this.defaultValue,
            examples: this.examples,
            constraints: this.constraints,
            propertyType: this.propertyType
        });

        return json;
    }

    static async getPersistenceDocuments(persistence, parentID) {
        return persistence.documents(TYPE, { parentID }, true);
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);
        this.persistenceId = json.id;
        this.defaultValue = json.defaultValue;
        this.examples = json.examples;
        this.constraints = json.constraints;
        this.propertyType = json.propertyType;
        return this;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new BasicProperty(parent, json.warpjsId, json.name, json.desc, json.propertyType);
        await instance.fromPersistenceJSON(persistence, json);
        return instance;
    }

    clone(persistence, instance, clone) {
        clone[this.name] = instance[this.name];
    }
}

module.exports = BasicProperty;
