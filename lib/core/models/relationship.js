const _ = require('lodash');
// const debug = require('debug')('W2:models:relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const uuid = require('uuid/v4');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');
const ComplexTypes = require('./../complex-types');
const isLastDocLevel = require('./../is-last-doc-level');
const updatePathInfo = require('./../update-path-info');

const TYPE = ComplexTypes.Relationship;

class Relationship extends Base {
    constructor(parent, target, id, isAggregation, name) {
        super(TYPE, parent, id, name, "");
        this.isAggregation = isAggregation;
        this.targetEntity = [target];
        this.sourceRole = "Source Role";
        this.sourceMin = "1";
        this.sourceMax = "*";
        this.sourceAverage = "/";
        this.targetRole = "Target Role";
        this.targetMin = "0";
        this.targetMax = "*";
        this.targetAverage = "/";

        this.updateDesc();
    }

    // eslint-disable-next-line camelcase
    getParent_Entity() {
        return this.parent;
    }

    updateDesc() {
        var target = this.hasTargetEntity() && typeof this.getTargetEntity() === "object"
            ? this.targetEntity[0].name
            : "undefined";
        if (this.isAggregation) {
            this.desc = `${this.name}: ${this.parent.name}[${target}] (1:${this.getTargetCardinality()})`;
        } else {
            this.desc = `${this.name}: ${this.parent.name}=>${target} (${this.getSourceCardinality()}:${this.getTargetCardinality()})`;
        }
    }

    getTargetReferences(instance) {
        const targetEntity = this.getTargetEntity();
        // debug(`getTargetReferences(): this=`, this.type);
        // debug(`getTargetReferences(): targetEntity=`, targetEntity.type);

        initializeRelationships(instance);

        if (targetEntity.isDocument()) {
            const relationshipReferences = (this.isAggregation) ? instance.aggregations : instance.associations;

            const filtered = relationshipReferences.find((obj) => obj.relnID === this.id);

            if (filtered) {
                return filtered.data;
            } else {
                // The relationship is missing. Add a new one.
                const newRef = {
                    relnID: this.id,
                    relnName: this.name,
                    data: []
                };
                relationshipReferences.push(newRef);
                return newRef.data;
            }
        } else {
            const embedded = instance.embedded.find((embed) => embed.parentRelnID === this.id);
            if (embedded) {
                if (!embedded.entities) {
                    embedded.entities = [];
                }
                return embedded.entities;
            } else {
                // The relationship is missing. Add it.
                const newEmbedded = {
                    parentRelnID: this.id,
                    parentRelnName: this.name,
                    entities: []
                };

                instance.embedded.push(newEmbedded);
                return newEmbedded.entities;
            }
        }
    }

    hasTargetEntity() {
        return this.targetEntity &&
            this.targetEntity.length &&
            this.targetEntity[0] != null &&
            typeof this.targetEntity[0] === "object" &&
            this.targetEntity[0].constructor !== Array;
    }

    getTargetEntity() {
        return this.targetEntity[0];
    }

    setTargetEntity(te) {
        this.targetEntity = te ? [te] : [];
    }

    getTargetCardinality() {
        if (this.targetAverage === "1") {
            return "1";
        } else {
            return parseInt(this.targetAverage) < parseInt(this.getDomain().definitionOfMany) ? "Few" : "Many";
        }
    }

    getSourceCardinality() {
        if (this.sourceAverage === "1") {
            return "1";
        } else {
            return parseInt(this.sourceAverage) < parseInt(this.getDomain().definitionOfMany) ? "Few" : "Many";
        }
    }

    getDocuments(persistence, instance) {
        const targetEntity = this.getTargetEntity();
        const references = this.getTargetReferences(instance);

        if (this.isAggregation) {
            if (!targetEntity.isDocument()) {
                return Promise.resolve(references);
            }

            return targetEntity.getChildren(persistence, instance.id);
        }

        if (targetEntity.isAbstract) {
            const domain = targetEntity.getDomain();
            return Promise.map(references, (reference) => Promise.resolve()
                .then(() => domain.getEntityByName(reference.type))
                .then((nonAbstractEntity) => nonAbstractEntity.getInstance(persistence, reference._id))
                .then((targetInstance) => {
                    targetInstance.relnDesc = reference.desc;
                    return targetInstance;
                })
            );
        }

        return Promise.reduce(
            references,
            (memo, reference) => targetEntity.getInstance(persistence, reference._id)
                .then((targetInstance) => {
                    targetInstance.relnDesc = reference.desc;
                    return targetInstance;
                })
                .then((targetInstance) => memo.concat(targetInstance)),
            []
        );
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
            isAggregation: this.isAggregation,
            targetEntity: this.hasTargetEntity() ? [this.getTargetEntity().idToJSON()] : [],
            sourceRole: this.sourceRole,
            sourceMin: this.sourceMin,
            sourceMax: this.sourceMax,
            sourceAverage: this.sourceAverage,
            targetRole: this.targetRole,
            targetMin: this.targetMin,
            targetMax: this.targetMax,
            targetAverage: this.targetAverage
        });
    }

    fromJSON(jsonData) {
        super.fromJSON(jsonData);

        this.sourceRole = jsonData.sourceRole;
        this.sourceMin = jsonData.sourceMin;
        this.sourceMax = jsonData.sourceMax;
        this.sourceAverage = jsonData.sourceAverage;
        this.targetRole = jsonData.targetRole;
        this.targetMin = jsonData.targetMin;
        this.targetMax = jsonData.targetMax;
        this.targetAverage = jsonData.targetAverage;
    }

    static fromFileJSON(jsonData, parent) {
        super.validateFromFileJSON(jsonData, TYPE);

        const instance = new Relationship(parent, jsonData.targetEntity[0], jsonData.id, jsonData.isAggregation, jsonData.name, jsonData.desc);
        instance.fromJSON(jsonData);
        return instance;
    }

    toString() {
        var s = this.isAggregation ? ":" : "=>";
        var target = this.hasTargetEntity() ? this.getTargetEntity().name : "undefined";
        return this.name + s + target + (this.targetMax === '*' ? '*' : '');
    }

    toFormResourceBase() {
        return _.extend({}, super.toFormResourceBase(), {
            isAggregation: this.isAggregation
        });
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        const domain = this.getDomain().name;
        docLevel = docLevel.concat(`Relationship:${this.name}`);

        const href = instance.id
            ? RoutesInfo.expand('W2:content:instance-relationship', { domain, type: instance.type, id: instance.id, relationship: this.name })
            : relativeToDocument.href;

        const resource = warpjsUtils.createResource(href, _.extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.join('.')
        }));

        resource.link('types', RoutesInfo.expand('W2:content:entity', {
            domain,
            type: this.getTargetEntity().name,
            profile: 'withChildren' // FIXME: Use routes constant
        }));

        return Promise.resolve()
            // .then(() => debug(`toFormResource(): instance=`, instance))
            .then(() => this.getDocuments(persistence, instance))
            .then((docs) => docs.map((doc, index) => _.extend({}, doc, {
                indexPosition: index,
                displayName: this.getDisplayName(doc)
            })))
            .then((docs) => {
                resource.totalSize = docs.length;
                resource.pageStart = docs.length ? 1 : 0;
                resource.pageEnd = docs.length;
                resource.limitLeft = 0;
                resource.limitRight = Math.max(0, docs.length - 1);

                // FIXME: Convert this into embedded with all pages links.
                if (resource.totalSize > resource.pageEnd) {
                    resource.link('nextPage', RoutesInfo.expand('W2:content:instance-relationship-page', {
                        domain,
                        type: instance.type,
                        id: instance.id,
                        relationship: this.name,
                        page: 2
                    }));
                }

                return this.getTargetEntity().toFormResource(persistence, instance, docLevel, docs, relativeToDocument);
            })
            .then((model) => {
                resource.model = model; // FIXME: embed()
            })
            .then(() => resource);
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, style) {
        let href;

        if (instance.id) {
            docLevel = docLevel.empty().addRelationship(this.name);
            relativeToDocument = {
                domain: relativeToDocument.domain,
                type: instance.type, // FIXME
                id: instance.id,
                href: RoutesInfo.expand(routes.instance, {
                    domain: relativeToDocument.domain,
                    type: instance.type,
                    id: instance.id
                })
            };

            href = RoutesInfo.expand(routes.relationship, {
                domain: relativeToDocument.domain,
                type: relativeToDocument.type,
                id: relativeToDocument.id,
                relationship: this.name
            });
        } else {
            // debug(` no instance.id... name:${this.name}`);
            docLevel = docLevel.addRelationship(this.name);
        }

        return Promise.resolve()
            .then(() => warpjsUtils.createResource(href, _.extend({}, this.toFormResourceBase(), {
                docLevel: docLevel.toString()
            })))
            .then((resource) => Promise.resolve()
                .then(() => {
                    // FIXME: This is a hack for parentClass and targetEntity.
                    if (this.name === 'parentClass') {
                        const entitiesUrl = RoutesInfo.expand(routes.types, {
                            domain: relativeToDocument.domain,
                            profile: routes.PROFILES.parentClass
                        });

                        // debug(`entitiesUrl=${entitiesUrl}`);
                        resource.link('types', entitiesUrl);

                        return this.getTargetEntity().getDocuments(
                            persistence,
                            { warpjsId: instance.parentClass }
                        );
                    } else if (this.name === 'targetEntity') {
                        const entitiesUrl = RoutesInfo.expand(routes.types, {
                            domain: relativeToDocument.domain,
                            profile: routes.PROFILES.targetEntity
                        });

                        resource.link('types', entitiesUrl);

                        return this.getTargetEntity().getDocuments(
                            persistence,
                            { warpjsId: instance.targetEntity }
                        );
                    } else if (this.name === 'relationship' && instance.type === ComplexTypes.RelationshipPanelItem) {
                        // This is the target relationship of a panel item (in a PageView)
                        const entitiesUrl = RoutesInfo.expand(routes.relationship, {
                            domain: relativeToDocument.domain,
                            type: relativeToDocument.type,
                            id: relativeToDocument.id,
                            relationship: this.name,
                            profile: routes.PROFILES.types
                        });
                        resource.link('types', entitiesUrl);

                        const entity = this.getDomain().getEntityByName(ComplexTypes.Relationship);
                        // debug(`relationship: instance=`, instance);
                        return entity.getDocuments(persistence, { warpjsId: instance.relationship });
                    } else if (this.name === 'basicProperty' && instance.type === ComplexTypes.BasicPropertyPanelItem) {
                        // This is the target basic property of a panel item (in a PageView)
                        const entitiesUrl = RoutesInfo.expand(routes.relationship, {
                            domain: relativeToDocument.domain,
                            type: relativeToDocument.type,
                            id: relativeToDocument.id,
                            relationship: this.name,
                            profile: routes.PROFILES.types
                        });
                        resource.link('types', entitiesUrl);

                        const entity = this.getDomain().getEntityByName(ComplexTypes.BasicProperty);
                        // debug(`basic property instance=`, instance);
                        return entity.getDocuments(persistence, { warpjsId: instance.basicProperty });
                    } else if (this.name === 'enumeration' && instance.type === ComplexTypes.EnumPanelItem) {
                        // This is the target enumeration of a panel item (in a PageView)
                        const entitiesUrl = RoutesInfo.expand(routes.relationship, {
                            domain: relativeToDocument.domain,
                            type: relativeToDocument.type,
                            id: relativeToDocument.id,
                            relationship: this.name,
                            profile: routes.PROFILES.types
                        });
                        resource.link('types', entitiesUrl);

                        const entity = this.getDomain().getEntityByName(ComplexTypes.Enumeration);
                        // debug(`enumeration instance=`, instance);
                        return entity.getDocuments(persistence, { warpjsId: instance.enumeration });
                    } else {
                        const entitiesUrl = RoutesInfo.expand(routes.instance, {
                            domain: relativeToDocument.domain,
                            type: this.getTargetEntity().name,
                            id: this.getTargetEntity().id,
                            profile: routes.PROFILES.withChildren
                        });
                        resource.link('types', entitiesUrl);

                        return this.getDocuments(persistence, instance);
                    }
                })
                .then((docs) => docs.map((doc, index) => _.extend({}, doc, {
                    indexPosition: index,
                    displayName: this.getDisplayName(doc)
                })))
                .then((docs) => {
                    resource.totalSize = docs.length;
                    resource.pageStart = docs.length ? 1 : 0;
                    resource.pageEnd = docs.length;
                    resource.limitLeft = 0;
                    resource.limitRight = Math.max(0, docs.length - 1);

                    // FIXME: Convert this into embedded with all pages links.
                    if (resource.totalSize > resource.pageEnd) {
                        resource.link('nextPage', RoutesInfo.expand(routes.relationshipPage, {
                            domain: relativeToDocument.domain,
                            type: instance.type,
                            id: instance.id,
                            relationship: this.name,
                            page: 2
                        }));
                    }

                    return this.getTargetEntity().toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, docs, style);
                })
                .then((model) => {
                    resource.model = model; // FIXME: embed()
                })

                .then(() => resource)
            )
        ;
    }

    patch(updatePath, updatePathLevel, instance, updateValue, patchAction) {
        const currentPatch = updatePathInfo(updatePath, updatePathLevel);
        const targetEntity = this.getTargetEntity();
        // debug(`patch(): name=${this.name}; targetEntity=${targetEntity.name}`);

        if (targetEntity.entityType === 'Embedded') {
            const relationshipInstances = instance.embedded.filter((element) => element.parentRelnID === this.id)[0].entities;
            const relationshipInstance = relationshipInstances.filter((element) => element._id === currentPatch[1])[0];
            return Promise.resolve()
                .then(() => targetEntity.patch(updatePath, updatePathLevel + 1, relationshipInstance, updateValue, patchAction))
            ;
        } else if (targetEntity.entityType === 'Document') {
            if (patchAction) {
                const patchActionData = patchAction.split(':');
                this.removeAssociation(instance, {type: patchActionData[1], id: patchActionData[2]});
                return {};
            } else {
                const found = this.getTargetReferences(instance).find((reference) => reference._id === currentPatch[1]);
                if (found) {
                // FIXME: Is this the only thing that can be changed?
                    const oldValue = found.desc;
                    found.desc = updateValue;
                    return {
                        newValue: updateValue,
                        oldValue
                    };
                } else {
                    throw new Error(`TODO: The relationship doesn't exist?`);
                }
            }
        } else {
            throw new Error(`TODO: Relationship: targetEntity.entityType=${targetEntity.entityType}`);
        }
    }

    /**
     *  Adds a new association. It checks if it's a duplicate and does not add
     *  it.
     */
    addAssociation(instance, data) {
        instance.associations = instance.associations || [];

        const filteredAssociations = instance.associations.filter((association) => association.relnID === this.id);

        let association;
        if (filteredAssociations.length) {
            association = filteredAssociations[0];
        } else {
            association = {
                relnID: this.id,
                relnName: this.name,
                data: []
            };
            instance.associations.push(association);
        }

        const filteredData = association.data.filter((reference) => {
            return (reference._id === data.id && reference.type === data.type);
        });

        if (!filteredData.length) {
            association.data.push({
                _id: data.id,
                type: data.type,
                desc: ''
            });
        }

        return instance;
    }

    /**
     *  Removes an association from the instance if it exists.
     */
    removeAssociation(instance, data) {
        if (instance.associations) {
            const filteredAssociations = instance.associations.filter((association) => association.relnID === this.id);
            if (filteredAssociations.length) {
                const association = filteredAssociations[0];

                association.data = association.data.filter((ref) => (ref._id !== data.id || ref.type !== data.type));
            }
        }
        return instance;
    }

    addEmbedded(instanceEmbedded, docLevel, level) {
        let filteredEmbedded = instanceEmbedded.filter((embedded) => embedded.parentRelnID === this.id);
        if (!filteredEmbedded.length) {
            instanceEmbedded.push({
                parentRelnID: this.id,
                parentRelnName: this.name, // FIXME: DEBUG ONLY
                entities: []
            });

            filteredEmbedded = instanceEmbedded.filter((embedded) => embedded.parentRelnID === this.id);
        }

        const embedded = filteredEmbedded.pop();

        if (!embedded.entities) {
            embedded.entities = [];
        }

        const targetEntity = this.getTargetEntity();
        if (isLastDocLevel(docLevel, level)) {
            const newInstance = targetEntity.newInstance();
            embedded.entities.push(newInstance);
            return newInstance;
        } else {
            const nextDocLevel = updatePathInfo(docLevel, level + 1);
            const filteredEntity = embedded.entities.filter((entity) => entity._id === nextDocLevel[1]);

            if (!filteredEntity.length) {
                throw new Error(`Cannot find element '${nextDocLevel[0]}:${nextDocLevel[1]}' from '${docLevel}'.`);
            }

            const entityInstance = filteredEntity.pop();
            return targetEntity.addEmbedded(entityInstance, docLevel, level + 2);
        }
    }

    removeEmbedded(instanceEmbedded, docLevel, level) {
        const filteredEmbedded = instanceEmbedded.filter((embedded) => embedded.parentRelnID === this.id);
        if (filteredEmbedded.length) {
            const embedded = filteredEmbedded[0];
            const nextDocLevel = updatePathInfo(docLevel, level + 1);

            if (isLastDocLevel(docLevel, level + 1)) {
                embedded.entities = embedded.entities.filter((entity) => entity._id !== nextDocLevel[1]);
            } else {
                const targetEntity = this.getTargetEntity();
                const currentPatch = updatePathInfo(docLevel, level + 1);
                const entities = embedded.entities.filter((entity) => entity._id === currentPatch[1]);
                if (entities.length) {
                    targetEntity.removeEmbedded(entities[0], docLevel, level + 2);
                }
            }
        }

        return instanceEmbedded;
    }

    createTargetInstance() {
        const model = this.getTargetEntity();
        const instance = model.newInstance(this);
        return {
            model,
            instance
        };
    }

    addTargetInstance(persistence, instance, targetInstance) {
        const targetEntity = this.getTargetEntity();

        initializeRelationships(instance);

        if (targetEntity.isDocument()) {
            targetInstance.parentRelnID = this.id;
            targetInstance.parentRelnName = this.name;

            const relationships = (this.isAggregation) ? instance.aggregations : instance.associations;
            let relationshipData = relationships.find((relationship) => relationship.parentRelnID === this.id);
            if (!relationshipData) {
                relationshipData = {
                    relnID: this.id,
                    relnName: this.name,
                    data: []
                };
                relationships.push(relationshipData);
            }

            if (!targetInstance._id) {
                // TODO: Need to save the targetInstance to DB first to get _id.
            }

            relationshipData.data.push({
                _id: targetInstance._id,
                type: targetInstance.type,
                desc: null
            });
        } else {
            let relationshipData = instance.embedded.find((embed) => embed.parentRelnID === this.id);
            if (!relationshipData) {
                relationshipData = {
                    parentRelnID: this.id,
                    parentRelnName: this.name,
                    entities: []
                };
                instance.embedded.push(relationshipData);
            }

            if (!targetInstance._id) {
                targetInstance._id = uuid();
            }

            relationshipData.entities.push(targetInstance);
        }
        return targetInstance;
    }

    save(persistence, parentID) {
        return Promise.resolve()
            .then(() => super.save(persistence, parentID))
        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            // constructor
            id: this.persistenceId,
            isAggregation: this.isAggregation,
            targetEntity: this.hasTargetEntity() ? this.getTargetEntity().idToJSON() : null,

            sourceRole: this.sourceRole,
            sourceMin: this.sourceMin,
            sourceMax: this.sourceMax,
            sourceAverage: this.sourceAverage,
            targetRole: this.targetRole,
            targetMin: this.targetMin,
            targetMax: this.targetMax,
            targetAverage: this.targetAverage
        });

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.persistenceId = json.id;
                this.sourceRole = json.sourceRole;
                this.sourceMin = json.sourceMin;
                this.sourceMax = json.sourceMax;
                this.sourceAverage = json.sourceAverage;
                this.targetRole = json.targetRole;
                this.targetMin = json.targetMin;
                this.targetMax = json.targetMax;
                this.targetAverage = json.targetAverage;
                this.setTargetEntity(json.targetEntity);
            })
            .then(() => this)
        ;
    }

    static getPersistenceDocuments(persistence, parentID) {
        return Promise.resolve()
            .then(() => persistence.documents(TYPE, { parentID }, true))
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new Relationship(parent, json.targetEntity, json.warpjsId, json.isAggregation, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }
}

function initializeRelationships(instance) {
    if (!instance.embedded) {
        instance.embedded = [];
    }
    if (!instance.aggregations) {
        instance.aggregations = [];
    }
    if (!instance.associations) {
        instance.associations = [];
    }
}

module.exports = Relationship;
