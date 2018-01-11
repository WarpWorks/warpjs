const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const ComplexTypes = require('./../complex-types');
const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
const PanelItem = require('./panel-item');

class BasicPropertyPanelItem extends PanelItem {
    constructor(parent, id, name, desc, basicProperty) {
        super("BasicPropertyPanelItem", parent, id, name, desc);
        this.label = name;
        this.readOnly = false;
        this.actions = [];

        if (basicProperty) {
            // Check if of Type "Relationship"
            if (!basicProperty.isOfType(ComplexTypes.BasicProperty)) {
                throw new Error("Create RelationshipPanelItem: Wrong Type! Expected: 'BasicProperty', was: '" + basicProperty.type + "'");
            }

            // Check if property belongs to same entity:
            var myEntity = this.parent.parent.parent;
            while (true) {
                var rel = myEntity.findElementByID(basicProperty.id, true);
                if (rel) {
                    break;
                } // ok!
                if (!myEntity.hasParentClass()) { // No more options...
                    throw new Error("Create BasicPropertyPanelItem: Target property '" + basicProperty.getPath() + "' does not belong to entity '" + myEntity.getPath() + "'");
                }
                myEntity = myEntity.getParentClass();
            }

            this.basicProperty = [basicProperty];
        }
        // Else: Property will be set later by "createInstanceFromJSON()"
    }

    hasBasicProperty() {
        return this.basicProperty && this.basicProperty.length > 0 && this.basicProperty[0] != null;
    }

    getBasicProperty() {
        return this.basicProperty[0];
    }

    setBasicProperty(bp) {
        this.basicProperty = [bp];
    }

    toString() {
        return this.name + "[=>" + (this.hasBasicProperty() ? this.getBasicProperty().name : "undefined") + "]; ";
    }

    toJSON() {
        var bp = this.hasBasicProperty() ? [this.getBasicProperty().idToJSON()] : [];
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            readOnly: this.isReadOnly,
            basicProperty: bp
        };
    }

    toFormResource(persistence, instance, docLevel) {
        return Promise.resolve()
            .then(() => {
                if (this.hasBasicProperty()) {
                    const basicProperty = this.getBasicProperty();
                    return basicProperty.toFormResource(persistence, instance, docLevel.concat(`Basic:${basicProperty.name}`));
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
                readOnly: this.isReadOnly,
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
            basicProperty: this.hasBasicProperty() ? this.getBasicProperty().idToJSON() : null,

            warpjsId: this.idToJSON(),

            embedded: [{
                parentRelnID: 80,
                parentRelnName: 'actions',
                entities: this.actions.map((action) => action.toPersistenceJSON())
            }]
        };
    }

    static fromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve(new BasicPropertyPanelItem(parent, json.warpjsId, json.name, json.description))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.position = json.position;
                    instance.label = json.label;
                    instance.readOnly = json.readOnly;
                    instance.basicProperty = json.basicProperty ? [json.basicProperty] : [];
                })

                .then(() => fromPersistenceEmbeddedJson(persistence, instance, json.embedded, 80, Action, 'actions'))

                .then(() => instance)
            )
        ;
    }
}

module.exports = BasicPropertyPanelItem;
