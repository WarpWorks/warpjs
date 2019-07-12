const extend = require('lodash/extend');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
// const debug = require('./debug')('basic-property-panel-item');
const PanelItem = require('./panel-item');

const TYPE = ComplexTypes.BasicPropertyPanelItem;

class BasicPropertyPanelItem extends PanelItem {
    constructor(parent, id, name, desc, basicProperty) {
        super(TYPE, parent, id, name, desc);

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

            this.basicProperty = [ basicProperty ];
        }
        // Else: Property will be set later by "createInstanceFromJSON()"
    }

    hasBasicProperty() {
        return Boolean(this.basicProperty && this.basicProperty.length && this.basicProperty[0] !== null);
    }

    getBasicProperty() {
        return this.basicProperty[0];
    }

    setBasicProperty(bp) {
        if (bp !== null) {
            this.basicProperty = [ bp ];
        }
    }

    toString() {
        return `${this.name}[=>${this.hasBasicProperty() ? this.getBasicProperty().name : 'undefined'}]; `;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            position: this.position,
            label: this.label,
            readOnly: this.isReadOnly,
            basicProperty: this.hasBasicProperty() ? [ this.getBasicProperty().idToJSON() ] : []
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

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
        });
    }

    async toFormResource(persistence, instance, docLevel) {
        const basicProperty = this.hasBasicProperty() ? this.getBasicProperty() : undefined;
        const model = basicProperty
            ? await basicProperty.toFormResource(persistence, instance, docLevel.concat(`Basic:${basicProperty.name}`))
            : undefined
        ;

        return warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            isFormItem: true,
            docLevel: docLevel.join('.'),
            model
        }));
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            isFormItem: true,
            docLevel: docLevel.toString()
        }));

        if (this.hasBasicProperty()) {
            const basicProperty = this.getBasicProperty();
            resource.model = await basicProperty.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes);
        }

        return resource;
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            basicProperty: this.hasBasicProperty() ? this.getBasicProperty().idToJSON() : null
        });

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);
        await this.setBasicProperty(json.basicProperty);
        return this;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new BasicPropertyPanelItem(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }
}

module.exports = BasicPropertyPanelItem;
