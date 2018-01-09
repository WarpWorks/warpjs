const _ = require('lodash');
// const debug = require('debug')('W2:models:relationship');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const uuid = require('uuid/v4');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');
const isLastDocLevel = require('./../is-last-doc-level');
const updatePathInfo = require('./../update-path-info');

const TYPE = 'Relationship';

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
        // debug(`getTargetReferences(): name=${this.name}; targetEntity=${targetEntity.name}`);

        if (targetEntity.isDocument()) {
            const relationshipReferences = (this.isAggregation) ? instance.aggregations : instance.associations;
            if (!relationshipReferences || !relationshipReferences.length) {
                return [];
            }

            const filtered = relationshipReferences.find((obj) => obj.relnID === this.id);

            return filtered ? filtered.data : [];
        } else {
            initializeEmbedded(instance);

            const embedded = instance.embedded.find((embed) => embed.parentRelnID === this.id);
            return (embedded && embedded.entities) || [];
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
        this.targetEntity = [te];
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
        var tid = this.hasTargetEntity() ? [this.getTargetEntity().idToJSON()] : [];
        var res = {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            isAggregation: this.isAggregation,
            targetEntity: tid,
            sourceRole: this.sourceRole,
            sourceMin: this.sourceMin,
            sourceMax: this.sourceMax,
            sourceAverage: this.sourceAverage,
            targetRole: this.targetRole,
            targetMin: this.targetMin,
            targetMax: this.targetMax,
            targetAverage: this.targetAverage
        };
        return res;
    }

    toString() {
        var s = this.isAggregation ? ":" : "=>";
        var target = this.hasTargetEntity() ? this.getTargetEntity().name : "undefined";
        return this.name + s + target + (this.targetMax === '*' ? '*' : '');
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        const domain = this.getDomain().name;
        docLevel = docLevel.concat(`Relationship:${this.name}`);

        const resourceUrl = instance.id
            ? RoutesInfo.expand('W2:content:instance-relationship', { domain, type: instance.type, id: instance.id, relationship: this.name })
            : relativeToDocument.href;

        const resource = warpjsUtils.createResource(resourceUrl, {
            type: this.type,
            name: this.name,
            desc: this.desc,
            isAggregation: this.isAggregation,
            docLevel: docLevel.join('.')
        });

        resource.link('types', RoutesInfo.expand('W2:content:entity', {
            domain,
            type: this.getTargetEntity().name,
            profile: 'withChildren'
        }));

        return Promise.resolve()
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
                resource.model = model;
            })
            .then(() => resource);
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
        if (targetEntity.isDocument()) {
            targetInstance.parentRelnID = this.id;
            targetInstance.parentRelnName = this.name;

            initializeAggregations(instance);
            initializeAssociations(instance);

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
            initializeEmbedded(instance);

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

    toPersistenceJSON() {
        return {
            type: TYPE,
            name: this.name,
            description: this.desc,
            isAggregation: this.isAggregation,
            sourceRole: this.sourceRole,
            sourceMin: this.sourceMin,
            sourceMax: this.sourceMax,
            targetRole: this.targetRole,
            targetMin: this.targetMin,
            targetMax: this.targetMax,

            warjsId: this.id,
            id: this.persistenceId,

            embedded: []
        };
    }
}

function initializeEmbedded(instance) {
    if (!instance.embedded) {
        instance.embedded = [];
    }
}

function initializeAggregations(instance) {
    if (!instance.aggregations) {
        instance.aggregations = [];
    }
}

function initializeAssociations(instance) {
    if (!instance.associations) {
        instance.associations = [];
    }
}

module.exports = Relationship;
