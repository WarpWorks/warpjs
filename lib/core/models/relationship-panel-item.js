const extend = require('lodash/extend');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
// const debug = require('./debug')('relationship-panel-item');
const PanelItem = require('./panel-item');

const TYPE = ComplexTypes.RelationshipPanelItem;

class RelationshipPanelItem extends PanelItem {
    constructor(parent, id, name, desc, relationship) {
        super(TYPE, parent, id, name, desc);
        this.style = 'CSV';
        this.relationship = [];

        if (relationship) {
            // Check if of Type "Relationship"
            if (!relationship.isOfType(ComplexTypes.Relationship)) {
                throw new Error(`Create RelationshipPanelItem: Wrong Type! Expected: 'Relationship', was: '${relationship.type}'`);
            }

            // Check if relationship belongs to same entity:
            var myEntity = this.parent.parent.parent;
            while (true) {
                var rel = myEntity.findElementByID(relationship.id, true);
                if (rel) {
                    break;
                } // ok!
                if (!myEntity.hasParentClass()) { // No more options...
                    throw new Error(`Create RelationshipPanelItem: Target relationship '${relationship.getPath()}' does not belong to entity '${myEntity.getPath()}'`);
                }
                myEntity = myEntity.getParentClass();
            }

            this.setRelationship(relationship);
        }
        // Else: relationship will be set later by "createInstanceFromJSON()"
    }

    hasRelationship() {
        return this.relationship && this.relationship.length && this.relationship[0] != null;
    }

    getRelationship() {
        return this.relationship[0];
    }

    setRelationship(r) {
        if (r !== null) {
            this.relationship = [r];
        }
    }

    toString() {
        return `${this.name}[=>${this.getRelationship().name}]; `;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            style: this.style,
            relationship: this.hasRelationship() ? [this.getRelationship().idToJSON()] : []
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.style = json.style;
        this.relationship = json.relationship;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new RelationshipPanelItem(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
            style: this.style
        });
    }

    async toFormResource(persistence, instance, docLevel, relativeToDocument) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            isFormItem: (this.style === 'csv'),
            docLevel: docLevel.join('.')
        }));

        const relationship = this.getRelationship();

        resource.relationship = relationship
            ? await relationship.toFormResource(persistence, instance, docLevel, relativeToDocument)
            : null
        ;

        return resource;
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            isFormItem: (this.style === 'csv'),
            docLevel: docLevel.toString()
        }));

        const relationship = this.getRelationship();

        resource.relationship = await relationship.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, this.style);

        return resource;
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            style: this.style,
            relationship: this.hasRelationship() ? this.getRelationship().idToJSON() : null
        });

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

        this.style = json.style;
        this.setRelationship(json.relationship);

        return this;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new RelationshipPanelItem(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }
}

module.exports = RelationshipPanelItem;
