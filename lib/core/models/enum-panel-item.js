const extend = require('lodash/extend');
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
        return `${this.name}[=>${this.enumeration.name}]; `;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            enumeration: this.hasEnumeration() ? [this.getEnumeration().idToJSON()] : []
        });
    }

    fromJSON(json) {
        super.fromJSON(json);
        this.enumeration = json.enumeration;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new EnumPanelItem(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
        });
    }

    async toFormResource(persistence, instance, docLevel) {
        let model;

        if (this.hasEnumeration()) {
            const enumeration = this.getEnumeration();
            model = await enumeration.toFormResource(persistence, instance, docLevel.concat(`Enum:${enumeration.name}`));
        }

        return warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            isFormItem: true,
            docLevel: docLevel.join('.'),
            model
        }));
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        let model;

        if (this.hasEnumeration()) {
            const enumeration = this.getEnumeration();
            model = await enumeration.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes);
        }

        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            isFormItem: true,
            docLevel: docLevel.toString(),
            model
        }));

        return resource;
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            enumeration: this.hasEnumeration() ? this.getEnumeration().idToJSON() : null
        });

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

        this.setEnumeration(json.enumeration);

        return this;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new EnumPanelItem(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }
}

module.exports = EnumPanelItem;
