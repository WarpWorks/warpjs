const extend = require('lodash/extend');
const omit = require('lodash/omit');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const uuid = require('uuid/v4');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');
const ComplexTypes = require('./../complex-types');
// const debug = require('./debug')('relationship');
const EntityTypes = require('./../entity-types');
const isLastDocLevel = require('./../is-last-doc-level');
const SpecialRelationships = require('./../special-relationships');
const updatePathInfo = require('./../update-path-info');

const TYPE = ComplexTypes.Relationship;

const REVERSE_RELATIONSHIP_NAME_RE = /^_Reverse__(\d+)__Reverse_$/;

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

        // debug(`getTargetReferences(): targetEntity=`, targetEntity);
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

    async getDocuments(persistence, instance) {
        const targetEntity = this.getTargetEntity();
        const references = this.getTargetReferences(instance);

        if (this.isAggregation) {
            if (!targetEntity.isDocument()) {
                return references;
            }

            return targetEntity.getChildren(persistence, instance.id);
        } else if (targetEntity.isAbstract) {
            const domain = targetEntity.getDomain();

            const documents = await Promise.map(
                references,
                async (reference) => {
                    const nonAbstractEntity = await domain.getEntityByName(reference.type);
                    const targetInstance = await nonAbstractEntity.getInstance(persistence, reference._id);
                    targetInstance.relnDesc = reference.desc === undefined ? '' : reference.desc;
                    targetInstance.relnPosition = reference.position === undefined ? '' : reference.position;
                    return targetInstance;
                }
            );

            const existingDocuments = documents.filter((doc) => doc.type);
            return existingDocuments.sort(warpjsUtils.byPositionThenName);
        } else {
            const documents = await Promise.reduce(
                references,
                async (memo, reference) => {
                    const targetInstance = await targetEntity.getInstance(persistence, reference._id);

                    targetInstance.relnDesc = reference.desc === undefined ? '' : reference.desc;
                    targetInstance.relnPosition = reference.position === undefined ? '' : reference.position;

                    return memo.concat(targetInstance);
                },
                []
            );

            const existingDocuments = documents.filter((doc) => doc.type);
            return existingDocuments.sort(warpjsUtils.byPositionThenName);
        }
    }

    toJSON() {
        return extend({}, super.toJSON(), {
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
        return []
            .concat(this.name)
            .concat(`@${this.id}`)
            .concat(this.isAggregation ? ':' : '=>')
            .concat(this.hasTargetEntity() ? this.getTargetEntity().name : 'undefined')
            .concat(this.targetMax === '*' ? '*' : [])
            .join('')
        ;
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
            isAggregation: this.isAggregation
        });
    }

    async toFormResource(persistence, instance, docLevel, relativeToDocument) {
        const domain = relativeToDocument ? relativeToDocument.domain : this.getDomain().name;
        docLevel = docLevel.concat(`Relationship:${this.name}`);

        const href = instance.id
            ? RoutesInfo.expand('W2:content:instance-relationship', { domain, type: instance.type, id: instance.id, relationship: this.name })
            : relativeToDocument.href;

        const resource = warpjsUtils.createResource(href, extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.join('.')
        }));

        resource.link('types', RoutesInfo.expand('W2:content:entity', {
            domain,
            type: this.getTargetEntity().name,
            profile: 'withChildren' // FIXME: Use routes constant
        }));

        // debug(`toFormResource(): instance=`, instance);
        const docs = await this.getDocuments(persistence, instance);

        docs.sort(warpjsUtils.byPositionThenName);

        const docsInfo = docs.map((doc, index) => extend({}, doc, {
            indexPosition: index,
            displayName: this.getDisplayName(doc)
        }));

        resource.totalSize = docsInfo.length;
        resource.pageStart = docsInfo.length ? 1 : 0;
        resource.pageEnd = docsInfo.length;
        resource.limitLeft = 0;
        resource.limitRight = Math.max(0, docsInfo.length - 1);

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

        const model = await this.getTargetEntity().toFormResource(persistence, instance, docLevel, docsInfo, relativeToDocument);
        resource.model = model; // FIXME: embed()

        return resource;
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, style) {
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

        const resource = warpjsUtils.createResource(href, extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.toString()
        }));

        let docs;

        // FIXME: This is a hack for parentClass and targetEntity.
        if (this.name === SpecialRelationships.PARENT_CLASS) {
            const entitiesUrl = RoutesInfo.expand(routes.types, {
                domain: relativeToDocument.domain,
                profile: routes.PROFILES.parentClass
            });

            // debug(`entitiesUrl=${entitiesUrl}`);
            resource.link('types', entitiesUrl);

            docs = await this.getTargetEntity().getDocuments(
                persistence,
                { warpjsId: instance.parentClass }
            );
        } else if (this.name === SpecialRelationships.TARGET_ENTITY) {
            const entitiesUrl = RoutesInfo.expand(routes.types, {
                domain: relativeToDocument.domain,
                profile: routes.PROFILES.targetEntity
            });

            resource.link('types', entitiesUrl);

            docs = await this.getTargetEntity().getDocuments(
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
            docs = await entity.getDocuments(persistence, { warpjsId: instance.relationship });
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
            docs = await entity.getDocuments(persistence, { warpjsId: instance.basicProperty });
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
            docs = await entity.getDocuments(persistence, { warpjsId: instance.enumeration });
        } else {
            const entitiesUrl = RoutesInfo.expand(routes.instance, {
                domain: relativeToDocument.domain,
                type: this.getTargetEntity().name,
                id: this.getTargetEntity().id,
                profile: routes.PROFILES.withChildren
            });
            resource.link('types', entitiesUrl);

            docs = await this.getDocuments(persistence, instance);
        }

        docs = docs.map((doc, index) => extend({}, doc, {
            indexPosition: index,
            displayName: this.getDisplayName(doc)
        }));

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

        const model = await this.getTargetEntity().toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, docs, style);

        resource.model = model; // FIXME: embed()

        return resource;
    }

    async patch(updatePath, updatePathLevel, instance, updateValue, patchAction) {
        const currentPatch = updatePathInfo(updatePath, updatePathLevel);
        const targetEntity = this.getTargetEntity();
        // debug(`patch(): name=${this.name}; id=${this.id}; targetEntity=${targetEntity.name} (${targetEntity.entityType})`);

        if (targetEntity.entityType === EntityTypes.EMBEDDED) {
            const relationshipInstances = instance.embedded.filter((element) => element.parentRelnID === this.id)[0].entities;
            const relationshipInstance = relationshipInstances.filter((element) => element._id === currentPatch[1])[0];
            return targetEntity.patch(updatePath, updatePathLevel + 1, relationshipInstance, updateValue, patchAction);
        } else if (targetEntity.entityType === EntityTypes.DOCUMENT) {
            if (patchAction) {
                const patchActionData = patchAction.split(':');
                this.removeAssociation(instance, { type: patchActionData[1], id: patchActionData[2] });
                return {};
            } else {
                const found = this.getTargetReferences(instance).find((reference) => reference._id === currentPatch[1]);
                if (found) {
                    const nextLevel = updatePathInfo(updatePath, updatePathLevel + 1);

                    if (nextLevel[0] === 'Field') {
                        const field = nextLevel[1];
                        const oldValue = found[field];
                        found[field] = updateValue;
                        return {
                            newValue: updateValue,
                            oldValue
                        };
                    } else {
                        throw new Error(`Unknown path key: ${nextLevel[0]}.`);
                    }
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
     *  it. The data format is:
     *
     *      {
     *          id: "...",
     *          type: "EntityName",
     *          typeID: "EntityID",
     *          desc: "Description for this association.",
     *          position: <assocation ordering>
     *      }
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
                desc: data.desc || '',
                position: data.position
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

    newInstance(instance) {
        const targetEntity = this.getTargetEntity();

        if (targetEntity.isDocument()) {
            if (this.isAggregation) {
                instance.aggregations = instance.aggregations || [];
            } else {
                instance.associations = instance.associations || [];
            }

            const aggregationsOrAssociations = (this.isAggregation)
                ? instance.aggregations
                : instance.associations
            ;

            if (!aggregationsOrAssociations.find((reln) => reln.parentRelnID === this.id)) {
                aggregationsOrAssociations.push({
                    relnID: this.id,
                    relnName: this.name,
                    data: []
                });
            }
        } else {
            instance.embedded = instance.embedded || [];

            if (!instance.embedded.find((embed) => embed.parentRelnID === this.id)) {
                instance.embedded.push({
                    parentRelnID: this.id,
                    parentRelnName: this.name,
                    entities: []
                });
            }
        }
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

    async save(persistence, parentID) {
        return super.save(persistence, parentID);
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
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

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

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

        return this;
    }

    static async getPersistenceDocuments(persistence, parentID) {
        return persistence.documents(TYPE, { parentID }, true);
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new Relationship(parent, json.targetEntity, json.warpjsId, json.isAggregation, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }

    embed(instance, data) {
        instance.embedded = instance.embedded || [];

        let embedded = instance.embedded.find((embed) => embed.parentRelnID === this.id);
        if (!embedded) {
            embedded = {
                parentRelnID: this.id,
                parentRelnName: this.name,
                entities: []
            };
            instance.embedded.push(embedded);
        }

        const existingData = embedded.entities.find((entityInstance) => entityInstance._id === data._id);
        if (!existingData) {
            embedded.entities.push(data);
        }

        return instance;
    }

    async clone(persistence, instance, clone) {
        if (this.isAggregation) {
            const docs = await this.getDocuments(persistence, instance);

            await Promise.each(
                docs,
                async (document) => {
                    const targetEntity = this.getDomain().getEntityByInstance(document);
                    const clonedDocument = await targetEntity.clone(persistence, document, clone.id);

                    if (!targetEntity.isDocument()) {
                        this.embed(clone, clonedDocument);
                    }
                }
            );
        } else {
            await Promise.each(
                this.getTargetReferences(instance),
                async (targetReference) => {
                    const newRef = omit(targetReference, ['_id']);
                    extend(newRef, { id: targetReference._id });
                    await this.addAssociation(clone, newRef);
                }
            );
        }
    }

    isReverse() {
        return this.name.match(REVERSE_RELATIONSHIP_NAME_RE);
    }

    isReverseName(name) {
        return name.match(REVERSE_RELATIONSHIP_NAME_RE);
    }

    get reverseName() {
        // Because we can see the Target Entity, we just keep the relationship
        // name.
        return `_Reverse__${this.id}__Reverse_`;
    }

    generateReverseName(id) {
        return `_Reverse__${id}__Reverse_`;
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
