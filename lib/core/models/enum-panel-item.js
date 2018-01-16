const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const ComplexTypes = require('./../complex-types');
const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
const PanelItem = require('./panel-item');

const TYPE = ComplexTypes.EnumPanelItem;

class EnumPanelItem extends PanelItem {
    constructor(parent, id, name, desc, enumeration) {
        super(TYPE, parent, id, name, desc);

        this.label = name;
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

    toFormResource(persistence, instance, docLevel) {
        return Promise.resolve()
            .then(() => {
                if (this.hasEnumeration()) {
                    const enumeration = this.getEnumeration();
                    return enumeration.toFormResource(persistence, instance, docLevel.concat(`Enum:${enumeration.name}`));
                }
                return undefined;
            })
            .then((model) => warpjsUtils.createResource('', {
                name: this.name,
                desc: this.desc,
                type: this.type,
                id: this.idToJSON(),
                position: this.position,
                label: this.label,
                isFormItem: true,
                docLevel: docLevel.join('.'),
                model
            }));
    }

    toPersistenceJSON() {
        return _.extend({}, super.toPersistenceJSON(), {
            enumeration: this.hasEnumeration() ? this.getEnumeration().idToJSON() : null
        });
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new EnumPanelItem(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.position = json.position;
                    instance.label = json.label;
                    instance.readOnly = json.readOnly;

                    instance.setEnumeration(json.enumeration);
                })
                .then(() => fromPersistenceEmbeddedJson(persistence, instance, json.embedded, 80, Action, 'actions'))
                .then(() => instance)
            )
        ;
    }
}

module.exports = EnumPanelItem;
