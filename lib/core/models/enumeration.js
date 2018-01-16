const _ = require('lodash');
// const debug = require('debug')('W2:models:enumeration');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');
const ComplexTypes = require('./../complex-types');
const converters = require('./../converters');
const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
const Literal = require('./literal');
const utils = require('./../utils');
const ValidEnumSelections = require('./../valid-enum-selections');

const TYPE = ComplexTypes.Enumeration;

class Enumeration extends Base {
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
        var children = [["Literal", this.literals]];
        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    addNewLiteral(name, desc, validSelection) {
        var id = this.getDomain().createNewID();
        var newLiteral = new Literal(this, id, name, desc, validSelection);
        this.literals.push(newLiteral);
        return newLiteral;
    }

    getAllElements(includeSelf) {
        var r = [];
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

    getTestData() {
        if (this.literals && this.literals.length > 0) {
            return this.literals[Math.floor(Math.random() * this.literals.length)].name;
        } else {
            return "Undefined";
        }
    }

    toString() {
        const literals = this.literals.map((literal) => literal.toString()).join("|");
        return `${this.name}:[${literals}]`;
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
            validEnumSelections: this.validEnumSelections,
            literals: utils.mapJSON(this.literals)
        });
    }

    fromJSON(json) {
        super.fromJSON(json);
        this.validEnumSelections = json.validEnumSelections;
        this.literals = this.fromJsonMapper(Literal, json.literals);
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);
        const instance = new Enumeration(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResource(persistence, instance, docLevel) {
        return Promise.resolve()
            .then(() => Promise.map(this.literals, (literal) => literal.toFormResource(persistence, instance, docLevel, instance[this.name])))
            .then((literals) => {
                const resource = warpjsUtils.createResource('', {
                    name: this.name,
                    desc: this.desc,
                    type: this.type,
                    id: this.idToJSON(),
                    validEnumSelections: this.validEnumSelections,
                    literals,
                    docLevel: docLevel.join('.')
                });

                const {max} = converters.minMax(this.validEnumSelections);
                resource.multiSelect = (max && max > 1);

                return resource;
            });
    }

    patch(updatePath, updatePathLevel, instance, potentialNewValue) {
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
    }

    toPersistenceJSON() {
        return _.extend({}, super.toPersistenceJSON(), {
            validEnumSelections: this.validEnumSelections,

            embedded: [
                this.mapChildrenPersistenceJSON(50, 'literals', this.getLiterals(true))
            ]
        });
    }

    static instantiateFromPersistenceJSON(persistance, json, parent) {
        return Promise.resolve()
            .then(() => new Enumeration(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.validEnumSelections = json.validEnumSelections;
                })

                .then(() => fromPersistenceEmbeddedJson(persistance, instance, json.embedded, 50, Literal, 'literals'))

                .then(() => instance)
            )
        ;
    }
}

module.exports = Enumeration;
