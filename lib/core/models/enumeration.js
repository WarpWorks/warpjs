const _ = require('lodash');
// const debug = require('debug')('W2:models:Enumeration');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
const converters = require('./../converters');
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

    toString() {
        const literals = this.literals.map((literal) => literal.toString()).join("|");
        return `${this.name}<${this.id}>:[${literals}]`;
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
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
        return _.extend({}, super.toFormResourceBase(), {
            validEnumSelections: this.validEnumSelections
        });
    }

    toFormResource(persistence, instance, docLevel) {
        return Promise.resolve()
            .then(() => Promise.map(
                this.literals,
                (literal) => literal.toFormResource(persistence, instance, docLevel, instance[this.name])
            ))
            .then((literals) => {
                const resource = warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                    literals,
                    docLevel: docLevel.join('.')
                }));

                const {max} = converters.minMax(this.validEnumSelections);
                resource.multiSelect = (max && max > 1);

                return resource;
            })
        ;
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
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

        return Promise.resolve()
            .then(() => warpjsUtils.createResource(href, _.extend({}, this.toFormResourceBase(), {
                docLevel: docLevel.toString()
            })))
            .then((resource) => Promise.resolve()
                .then(() => Promise.map(
                    this.literals,
                    (literal) => literal.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, instance[this.name])
                ))
                .then((literals) => {
                    resource.literals = literals; // FIXME: embed

                    const { max } = converters.minMax(this.validEnumSelections);
                    resource.multiSelect = (max && max > 1);
                })
                .then(() => resource)
            )
        ;
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

    save(persistence, parentID) {
        return Promise.resolve()
            .then(() => super.save(persistence, parentID))
        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            id: this.persistenceId,
            validEnumSelections: this.validEnumSelections
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(50, 'literals', this.getLiterals(true)));

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(json))
            .then(() => {
                this.persistenceId = json.id;
                this.validEnumSelections = json.validEnumSelections;
            })
            .then(() => this.fromPersistenceEmbeddedJson(persistence, json.embedded, 50, Literal, 'literals'))
            .then(() => this)
        ;
    }

    static getPersistenceDocuments(persistence, parentID) {
        return Promise.resolve()
            .then(() => persistence.documents(TYPE, { parentID }, true))
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new Enumeration(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }

    setValue(instance, newValue) {
        const literal = this.getLiterals().find((literal) => literal.name === newValue);
        if (literal) {
            const oldValue = instance[this.name];
            instance[this.name] = newValue;
            return { oldValue, newValue };
        }
    }
}

module.exports = Enumeration;
