const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
const PanelItem = require('./panel-item');

const TYPE = ComplexTypes.RelationshipPanelItem;

class RelationshipPanelItem extends PanelItem {
    constructor(parent, id, name, desc, relationship) {
        super(TYPE, parent, id, name, desc);
        this.label = name;
        this.style = 'CSV';
        this.actions = [];
        this.relationship = [];

        if (relationship) {
            // Check if of Type "Relationship"
            if (!relationship.isOfType(ComplexTypes.Relationship)) {
                throw new Error("Create RelationshipPanelItem: Wrong Type! Expected: 'Relationship', was: '" + relationship.type + "'");
            }

            // Check if relationship belongs to same entity:
            var myEntity = this.parent.parent.parent;
            while (true) {
                var rel = myEntity.findElementByID(relationship.id, true);
                if (rel) {
                    break;
                } // ok!
                if (!myEntity.hasParentClass()) { // No more options...
                    throw new Error("Create RelationshipPanelItem: Target relationship '" + relationship.getPath() + "' does not belong to entity '" + myEntity.getPath() + "'");
                }
                myEntity = myEntity.getParentClass();
            }

            this.setRelationship(relationship);
        }
        // Else: relationship will be set later by "createInstanceFromJSON()"
    }

    hasRelationship() {
        return this.relationship && this.relationship.length > 0 && this.relationship[0] != null;
    }

    getRelationship() {
        return this.relationship[0];
    }

    setRelationship(r) {
        this.relationship = [r];
    }

    toString() {
        return this.name + "[=>" + this.getRelationship().name + "]; ";
    }

    toJSON() {
        var rid = this.hasRelationship() ? [this.getRelationship().idToJSON()] : [];
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            style: this.style,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            readOnly: this.isReadOnly,
            relationship: rid
        };
    }

    static fromFileJSON(jsonData, parent) {
        super.fromFileJSON(jsonData, parent, TYPE);

        const newRelationshipPanelItem = new RelationshipPanelItem(parent, jsonData.id, jsonData.name, jsonData.desc);
        newRelationshipPanelItem.position = jsonData.position;
        newRelationshipPanelItem.label = jsonData.label;
        newRelationshipPanelItem.relationship = jsonData.relationship;
        newRelationshipPanelItem.style = jsonData.style;
        return newRelationshipPanelItem;
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve(this.getRelationship())
            .then((relationship) => relationship.toFormResource(persistence, instance, docLevel, relativeToDocument))
            .then((relationship) => warpjsUtils.createResource('', {
                name: this.name,
                desc: this.desc,
                type: this.type,
                id: this.idToJSON(),
                position: this.position,
                label: this.label,
                readOnly: this.isReadOnly,
                style: this.style,
                isFormItem: (this.style === 'csv'),
                docLevel: docLevel.join('.'),
                relationship
            }));
    }

    toPersistenceJSON() {
        return _.extend({}, super.toPersistenceJSON(), {
            position: this.position,
            label: this.label,
            readOnly: this.isReadOnly,
            style: this.style,
            relationship: this.hasRelationship() ? this.getRelationship().idToJSON() : null,

            embedded: [{
                parentRelnID: 80,
                parentRelnName: 'actions',
                entities: this.actions.map((action) => action.toPersistenceJSON())
            }]
        });
    }

    static fromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve(new RelationshipPanelItem(parent, json.warpjsId, json.name, json.description))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.position = json.position;
                    instance.label = json.label;
                    instance.readOnly = json.readOnly;
                    instance.style = json.style;
                    instance.setRelationship(json.relationship);
                })
                .then(() => instance)
            )
        ;
    }
}

module.exports = RelationshipPanelItem;
