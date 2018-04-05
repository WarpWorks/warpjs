const _ = require('lodash');
// const debug = require('debug')('W2:models:relationship-panel-item');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
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
        return this.name + "[=>" + this.getRelationship().name + "]; ";
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
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
        return _.extend({}, super.toFormResourceBase(), {
            style: this.style
        });
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                isFormItem: (this.style === 'csv'),
                docLevel: docLevel.join('.')
            })))
            .then((resource) => Promise.resolve()
                .then(() => this.getRelationship())
                .then((relationship) => relationship.toFormResource(persistence, instance, docLevel, relativeToDocument))
                .then((relationship) => {
                    resource.relationship = relationship; // TODO: embed
                })
                .then(() => resource)
            )
        ;
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                isFormItem: (this.style === 'csv'),
                docLevel: docLevel.toString()
            })))
            .then((resource) => Promise.resolve()
                .then(() => this.getRelationship())
                .then((relationship) => relationship.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, this.style))
                .then((relationship) => {
                    resource.relationship = relationship; // TODO: embed
                })
                .then(() => resource)
            )

        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            style: this.style,
            relationship: this.hasRelationship() ? this.getRelationship().idToJSON() : null
        });

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.style = json.style;
                this.setRelationship(json.relationship);
            })
            .then(() => this)
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new RelationshipPanelItem(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }
}

module.exports = RelationshipPanelItem;
