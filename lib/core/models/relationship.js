const _ = require('lodash');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');
const updatePathInfo = require('./../update-path-info');

class Relationship extends Base {
    constructor(parent, target, id, isAggregation, name) {
        super("Relationship", parent, id, name, "");
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
        const relationship = (this.isAggregation) ? instance.aggregations : instance.associations;
        if (!relationship || !relationship.length) {
            return [];
        }

        const filtered = relationship.filter((obj) => obj.relnName === this.name);

        return filtered.length ? filtered[0].data : [];
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

        if (this.isAggregation) {
            if (!targetEntity.isDocument()) {
                return Promise.resolve()
                    .then(() => {
                        if (instance.embedded) {
                            const embeddedDocs = instance.embedded.filter((embedded) => embedded.parentRelnName === this.name);

                            if (embeddedDocs.length) {
                                return embeddedDocs[0].entities;
                            }
                        }
                        return [];
                    });
            }

            return targetEntity.getChildren(persistence, instance.id);
        }

        const references = this.getTargetReferences(instance);

        if (targetEntity.isAbstract) {
            const domain = targetEntity.getDomain();
            return Promise.map(references, (reference) => {
                const nonAbstractEntity = domain.getEntityByName(reference.type);
                return nonAbstractEntity.getInstance(persistence, reference._id);
            });
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

    toFormResource(persistence, instance, docLevel) {
        const domain = this.getDomain().name;
        docLevel = docLevel.concat(`Relationship:${this.name}`);

        const resourceUrl = RoutesInfo.expand('W2:content:instance-relationship', {
            domain,
            type: instance.type,
            id: instance.id,
            relationship: this.name
        });

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

                return this.getTargetEntity().toFormResource(persistence, instance, docLevel, docs);
            })
            .then((model) => {
                resource.model = model;
            })
            .then(() => resource);
    }

    patch(updatePath, updatePathLevel, instance, updateValue) {
        const currentPatch = updatePathInfo(updatePath, updatePathLevel);
        const targetEntity = this.getTargetEntity();

        if (targetEntity.entityType === 'Embedded') {
            const relationshipInstances = instance.embedded.filter((element) => element.parentRelnName === this.name)[0].entities;
            const relationshipInstance = relationshipInstances.filter((element) => element._id === currentPatch[1])[0];
            return Promise.resolve()
                .then(() => targetEntity.patch(updatePath, updatePathLevel + 1, relationshipInstance, updateValue))
            ;
        } else if (targetEntity.entityType === 'Document') {
            const references = this.getTargetReferences(instance).filter((reference) => reference._id === currentPatch[1]);
            if (references.length) {
                // FIXME: Is this the only thing that can be changed?
                const oldValue = references[0].desc;
                references[0].desc = updateValue;
                return oldValue;
            }
        } else {
            throw new Error(`TODO: Relationship: targetEntity.entityType=${targetEntity.entityType}`);
        }
    }

    addAssociation(instance, data) {
        return Promise.resolve()
            .then(() => {
                if (!instance.associations) {
                    instance.associations = [];
                }
            })
            .then(() => instance.associations.filter((association) => association.relnID === this.id))
            .then((associations) => {
                if (associations.length) {
                    return associations[0];
                }
                const newAssociation = {
                    relnID: this.id,
                    relnName: this.name,
                    data: []
                };
                instance.associations.push(newAssociation);
                return newAssociation;
            })
            .then((association) => {
                if (!association.data) {
                    association.data = [];
                }
                return association;
            })
            .then((association) => {
                const references = association.data.filter((ref) => ref._id === data.id && ref.type === data.type);
                if (!references.length) {
                    association.data.push({
                        _id: data.id,
                        type: data.type,
                        desc: ''
                    });
                }
            })
        ;
    }

    addData(instance, data) {
        if (this.isAggregation) {
            throw new Error("TODO: Insert a new aggregation");
        } else {
            this.addAssociation(instance, data);
        }
    }
}

module.exports = Relationship;
