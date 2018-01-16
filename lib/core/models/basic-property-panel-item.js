const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const ComplexTypes = require('./../complex-types');
const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
const PanelItem = require('./panel-item');

const TYPE = ComplexTypes.BasicPropertyPanelItem;

class BasicPropertyPanelItem extends PanelItem {
    constructor(parent, id, name, desc, basicProperty) {
        super(TYPE, parent, id, name, desc);
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
        return Boolean(this.basicProperty && this.basicProperty.length > 0 && this.basicProperty[0] !== null);
    }

    getBasicProperty() {
        return this.basicProperty[0];
    }

    setBasicProperty(bp) {
        if (bp !== null) {
            this.basicProperty = [bp];
        }
    }

    toString() {
        return this.name + "[=>" + (this.hasBasicProperty() ? this.getBasicProperty().name : "undefined") + "]; ";
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
            position: this.position,
            label: this.label,
            readOnly: this.isReadOnly,
            basicProperty: this.hasBasicProperty() ? [this.getBasicProperty().idToJSON()] : []
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.position = json.position;
        this.label = json.label;
        this.readOnly = json.readOnly || false;
        this.basicProperty = json.basicProperty;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new BasicPropertyPanelItem(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
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
        return _.extend({}, super.toPersistenceJSON(), {
            basicProperty: this.hasBasicProperty() ? this.getBasicProperty().idToJSON() : null
        });
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new BasicPropertyPanelItem(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.position = json.position;
                    instance.label = json.label;
                    instance.readOnly = json.readOnly;
                    instance.setBasicProperty(json.basicProperty);
                })

                .then(() => fromPersistenceEmbeddedJson(persistence, instance, json.embedded, 80, Action, 'actions'))

                .then(() => instance)
            )
        ;
    }
}

module.exports = BasicPropertyPanelItem;
