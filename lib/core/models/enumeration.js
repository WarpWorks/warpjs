const extend = require('lodash/extend');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
const converters = require('./../converters');
// const debug = require('./debug')('enumeration');
const Literal = require('./literal');
const Property = require('./property');
const utils = require('./../utils');
const ValidEnumSelections = require('./../valid-enum-selections');

const TYPE = ComplexTypes.Enumeration;

class Enumeration extends Property {
    constructor(entity, id, name, desc) {
        super(TYPE, entity, id, name, desc);
        this.validEnumSelections = ValidEnumSelections.ZeroOne;
        this.literals = [];
    }

    // eslint-disable-next-line camelcase
    getParent_Entity() {
        return this.parent;
    }

    // Keep same signature as others, but not doing anything with inheritance.
    getLiterals(ignoreInherited) {
        return this.literals;
    }

    processLocalTemplateFunctions(template) {
        const children = [[ "Literal", this.literals ]];
        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    addNewLiteral(name, desc, validSelection) {
        const id = this.getDomain().createNewID();
        const newLiteral = new Literal(this, id, name, desc, validSelection);
        this.literals.push(newLiteral);
        return newLiteral;
    }

    getAllElements(includeSelf) {
        let r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        // Add children with no own children directly:
        r = r.concat(this.literals);
        return r;
    }

    newInstance() {
        return (this.literals && this.literals.length && this.literals[0] && this.literals[0].newInstance()) || "Undefined";
    }

    toString() {
        const literals = this.literals.map((literal) => literal.toString()).join("|");
        return `${this.name}@${this.id}:[${literals}]`;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            validEnumSelections: this.validEnumSelections,
            literals: utils.mapJSON(this.literals)
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        // Force default because it's not saved to the JSN file.
        this.validEnumSelections = json.validEnumSelections || ValidEnumSelections.ZeroOne;
        this.literals = this.fromJsonMapper(Literal, json.literals);
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);
        const instance = new Enumeration(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
            validEnumSelections: this.validEnumSelections
        });
    }

    async toFormResource(persistence, instance, docLevel) {
        const literals = await Promise.map(
            this.literals,
            async (literal) => literal.toFormResource(persistence, instance, docLevel, instance[this.name])
        );

        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            literals,
            docLevel: docLevel.join('.')
        }));

        const { max } = converters.minMax(this.validEnumSelections);
        resource.multiSelect = (max && max > 1);

        return resource;
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        let href = '';

        if (instance.id) {
            docLevel = docLevel.empty().addEnumeration(this.name);

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
            docLevel = docLevel.addEnumeration(this.name);
            href = relativeToDocument.href;
        }

        const literals = await Promise.map(
            this.literals,
            async (literal) => literal.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, instance[this.name])
        );

        const { max } = converters.minMax(this.validEnumSelections);

        return warpjsUtils.createResource(href, extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.toString(),
            multiSelect: (max && max > 1),
            literals
        }));
    }

    patch(updatePath, updatePathLevel, instance, potentialNewValue) {
        if (potentialNewValue) {
            const newValue = this.getAllElements().filter((lit) => lit.name === potentialNewValue).pop();
            if (newValue) {
                const oldValue = instance[this.name];
                instance[this.name] = newValue.name;
                return {
                    newValue: newValue.name,
                    oldValue
                };
            } else {
                throw new Error(`Invalid new value: ${potentialNewValue}`);
            }
        } else {
            // Reset the value to empty.
            const oldValue = instance[this.name];
            instance[this.name] = potentialNewValue;
            return { oldValue, newValue: potentialNewValue };
        }
    }

    async save(persistence, parentID) {
        return super.save(persistence, parentID);
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            id: this.persistenceId,
            validEnumSelections: this.validEnumSelections
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(50, 'literals', this.getLiterals(true)));

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(json);

        this.persistenceId = json.id;
        this.validEnumSelections = json.validEnumSelections;

        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 50, Literal, 'literals');
        return this;
    }

    static async getPersistenceDocuments(persistence, parentID) {
        return persistence.documents(TYPE, { parentID }, true);
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new Enumeration(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }

    getValue(instance) {
        return instance[this.name];
    }

    async setValue(instance, newValue) {
        if (newValue) {
            const literal = this.getLiterals().find((literal) => literal.name === newValue);
            if (literal) {
                const oldValue = instance[this.name];
                instance[this.name] = newValue;
                return { oldValue, newValue };
            } else {
                throw new Error(`Invalid new value: ${newValue}`);
            }
        } else {
            // Reset the value to empty.
            const oldValue = instance[this.name];
            instance[this.name] = newValue;
            return { oldValue, newValue };
        }
    }

    clone(persistence, instance, clone) {
        clone[this.name] = instance[this.name];
    }
}

module.exports = Enumeration;
