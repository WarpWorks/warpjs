const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
const PanelItem = require('./panel-item');

const TYPE = ComplexTypes.EnumPanelItem;

class EnumPanelItem extends PanelItem {
    constructor(parent, id, name, desc, enumeration) {
        super(TYPE, parent, id, name, desc);

        this.actions = [];
        this.enumeration = [];

        if (enumeration) {
            // Check if of Type "Enumeration"
            if (!enumeration.isOfType(ComplexTypes.Enumeration)) {
                throw new Error("Create RelationshipPanelItem: Wrong Type! Expected: 'Enumeration', was: '" + enumeration.type + "'");
            }

            // Check if enum belongs to same entity:
            var myEntity = this.parent.parent.parent;
            while (true) {
                var rel = myEntity.findElementByID(enumeration.id, true);
                if (rel) {
                    break;
                } // ok!
                if (!myEntity.getParentClass()) { // No more options...
                    throw new Error("Create BasicPropertyPanelItem: Target enum '" + enumeration.getPath() + "' does not belong to entity '" + myEntity.getPath() + "'");
                }
                myEntity = myEntity.getParentClass();
            }

            this.setEnumeration(enumeration);
        }
        // Else: enumeration will be set later by "createInstanceFromJSON()"
    }

    hasEnumeration() {
        return this.enumeration && this.enumeration.length > 0 && this.enumeration[0] != null;
    }

    getEnumeration() {
        return this.enumeration[0];
    }

    setEnumeration(e) {
        if (e !== null) {
            this.enumeration = [e];
        }
    }

    toString() {
        return this.name + "[=>" + this.enumeration.name + "]; ";
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
            enumeration: this.hasEnumeration() ? [this.getEnumeration().idToJSON()] : []
        });
    }

    fromJSON(json) {
        this.enumeration = json.enumeration;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new EnumPanelItem(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return _.extend({}, super.toFormResourceBase(), {
        });
    }

    toFormResource(persistence, instance, docLevel) {
        return Promise.resolve()
            .then(() => {
                if (this.hasEnumeration()) {
                    const enumeration = this.getEnumeration();
                    return enumeration.toFormResource(persistence, instance, docLevel.concat(`Enum:${enumeration.name}`));
                }
                return undefined;
            })
            .then((model) => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                isFormItem: true,
                docLevel: docLevel.join('.'),
                model
            })));
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                isFormItem: true,
                docLevel: docLevel.join('.')
            })))
            .then((resource) => Promise.resolve()
                .then(() => {
                    if (this.hasEnumeration()) {
                        const enumeration = this.getEnumeration();
                        return enumeration.toStudioResource(persistence, instance, docLevel.concat(`Enum:${enumeration.name}`), relativeToDocument);
                    }
                })
                .then((model) => {
                    resource.model = model; // FIXME: embed
                })
                .then(() => resource)
            )
        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            enumeration: this.hasEnumeration() ? this.getEnumeration().idToJSON() : null
        });

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.setEnumeration(json.enumeration);
            })
            .then(() => this)
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new EnumPanelItem(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }
}

module.exports = EnumPanelItem;
