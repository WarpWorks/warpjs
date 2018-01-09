const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
const PanelItem = require('./panel-item');

class EnumPanelItem extends PanelItem {
    constructor(parent, id, name, desc, enumeration) {
        super("EnumPanelItem", parent, id, name, desc);
        this.label = name;
        this.actions = [];

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
        this.enumeration = [e];
    }

    toString() {
        return this.name + "[=>" + this.enumeration.name + "]; ";
    }

    toJSON() {
        var eid = this.hasEnumeration() ? [this.getEnumeration().idToJSON()] : [];
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            enumeration: eid
        };
    };

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
        return {
            type: this.type,
            name: this.name,
            description: this.desc,
            position: this.position,
            label: this.label,
            readOnly: this.isReadOnly,

            warpjsId: this.idToJSON(),
            id: this.persistenceId,

            embedded: [{
                parentRelnID: 80,
                parentRelnName: 'actions',
                entities: this.actions.map((action) => action.toPersistenceJSON())
            }]
        };
    }

}

module.exports = EnumPanelItem;
