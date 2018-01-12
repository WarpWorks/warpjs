const _ = require('lodash');
// const debug = require('debug')('W2:models:domain');
const Promise = require('bluebird');

const Base = require('./base');
const ComplexTypes = require('./../complex-types');
const Entity = require('./entity');
const fromPersistenceCollection = require('./from-persistence-collection');
const WarpWorksError = require('./../error');
const utils = require('./../utils');

const COLLECTION_NAME = 'Domain';
const TYPE = ComplexTypes.Domain;

class DomainError extends WarpWorksError {
}

class Domain extends Base {
    constructor(warpworks, name, desc, recreate) {
        // Special case - the parent of domain is warpworks, which is not of type "Base"
        // FIXME: This `1` is a hard-coded value.
        super(TYPE, warpworks, 1, name, desc);
        this.idCounter = 1;
        this.entities = [];
        this.definitionOfMany = 100;
        this.persistenceId = null;
        this.lastUpdated = null;

        // Create rootEntity entity:
        if (!recreate) {
            this.addNewEntity(this.name, `Root for domain ${this.name}`, null, false, true);
        }
    }

    save(persistence) {
        return Promise.resolve()
            .then(() => {
                if (!persistence) {
                    throw new DomainError("Should not be called without params");
                }
            })
            .then(() => this.toPersistenceJSON())
            .then((domainJson) => _.extend(domainJson, {
                lastUpdated: (new Date()).toISOString()
            }))
            .then((domainJson) => {
                if (domainJson.id) {
                    // Need to update in db
                    throw new Error("TODO: Update domain");
                }
                return Promise.resolve()
                    .then(() => persistence.save(COLLECTION_NAME, domainJson))
                    .then((saveResult) => saveResult.id)
                ;
            })
            .then((domainPersistenceId) => Promise.each(
                this.getEntities(),
                (entity, index, length) => entity.save(persistence, domainPersistenceId)
            ))
            .then(() => null)
        ;
    }

    createNewID() {
        if (this.idCounter < 2) {
            const max = Math.max(this.getAllElements().map((element) => element.id));
            this.idCounter = max + 1;
        }
        return this.idCounter++;
    }

    compareIDs(id1, id2) {
        return id1.toString() === id2.toString();
    }

    validateModel() {
        let i;
        let vRes = "";
        let wCount = 0;

        if (this.name === "New_Domain") {
            wCount++;
            vRes += "<br>[" + wCount + "]: <strong>" + this.name + "</strong> is not a unique name - please rename your Domain!";
        }

        // All Relationships need targets
        for (i in this.entities) {
            for (let j in this.entities[i].relationships) {
                if (!this.entities[i].relationships[j].hasTargetEntity()) {
                    wCount++;
                    vRes += "<br>[" + wCount + "]: <strong>" + this.entities[i].name + "::" + this.entities[i].relationships[j].name + "</strong> does not have a target!";
                }
            }
        }

        // All entities should either be abstract, root entity or aggregated by another entity (directly or through inheritance):
        for (i in this.entities) {
            if (!this.entities[i].isAbstract && !this.entities[i].canBeInstantiated()) {
                wCount++;
                vRes += "<br>[" + wCount + "]: <strong>" + this.entities[i].name + "</strong> can not be instantiated (solution: make it a RootEntity or child of another entity)";
            }
        }

        // No Entity of type "Embedded" should aggregate an Entity of type "Document"
        for (i in this.entities) {
            for (let j in this.entities[i].relationships) {
                if (!this.entities[i].isDocument() &&
                    this.entities[i].relationships[j].isAggregation &&
                    this.entities[i].relationships[j].hasTargetEntity() &&
                    this.entities[i].relationships[j].getTargetEntity().isDocument()) {
                    wCount++;
                    vRes += "<br>[" + wCount + "]: <strong>" + this.entities[i].name + "::" + this.entities[i].relationships[j].name + "</strong>: Embedded entity '" + this.entities[i].name + "' can not aggregate document-type '" + this.entities[i].relationships[j].getTargetEntity().name + "'!";
                }
            }
        }

        if (wCount === 0) {
            return null;
        }
        return wCount === 1 ? "<strong>1 Warning:</strong>" + vRes : "<strong>" + wCount + " Warnings:</strong>" + vRes;
    }

    getEntityByName(name) {
        const entities = this.getEntities().filter((entity) => entity.name === name);
        if (entities.length === 1) {
            return entities[0];
        }

        throw new DomainError(`Cannot find entity with name='${name}'.`);
    }

    getParentEntityByRelationship(parentRelnID) {
        return this.getEntities(/* true */).find((entity) => {
            return entity.getRelationships(/* true */).find((relationship) => {
                return relationship.id === parentRelnID;
            });
        });
    }

    /**
     *  Retrieve the parent's entity based on the information of
     *  `parentBaseClassName` from the instance data.
     */
    getParentEntityByParentBaseClassName(instance) {
        if (instance.parentBaseClassName) {
            return this.getEntityByName(instance.parentBaseClassName);
        }
        return null;
    }

    getEntities(sortByInheritance) {
        if (!sortByInheritance) {
            return this.entities;
        }
        for (var i in this.entities) {
            var entity = this.entities[i];
            entity.longName = entity.name;
            var tmpEntity = entity;
            while (tmpEntity.hasParentClass()) {
                tmpEntity = tmpEntity.getParentClass();
                entity.longName = tmpEntity.name + ":" + entity.longName;
            }
        }
        return this.entities.sort(function(a, b) {
            if (a.longName < b.longName) {
                return -1;
            }
            if (a.longName > b.longName) {
                return 1;
            }
            return 0;
        });
    }

    getRootEntities() {
        var allEntities = this.entities;
        var rootEntities = [];
        for (var i in allEntities) {
            if (allEntities[i].isRootEntity) {
                rootEntities.push(allEntities[i]);
            }
        }
        return allEntities;
    }

    getRootInstance() {
        var allEntities = this.entities;
        for (var i in allEntities) {
            if (allEntities[i].isRootInstance) {
                return allEntities[i];
            }
        }
        throw new Error("Domain without root instance!");
    }

    addEntity(newEntity) {
        return this.entities.push(newEntity);
    }

    addNewEntity(name, desc, parentClass, isRootEntity, isRootInstance) {
        var id = this.getDomain().createNewID();
        var newEntity = new Entity(this, id, name, desc, parentClass, isRootEntity, isRootInstance);

        this.addEntity(newEntity);
        return newEntity;
    }

    createNewDefaultViews() {
        this.getEntities().forEach(function(elem) {
            elem.createNewDefaultViews();
        });
    }

    getAllElements(includeSelf) {
        // Returns an array containing all child elements; optional: also include self
        var r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        for (var i in this.getEntities()) {
            r = r.concat(this.getEntities()[i].getAllElements(true));
        }
        return r;
    }

    getElementById(id, includeSelf) {
        return this.getAllElements(includeSelf).find((element) => String(element.id) === String(id));
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            definitionOfMany: this.definitionOfMany,
            entities: utils.mapJSON(this.getEntities())
        };
    }

    static fromFileJSON(jsonData, parent) {
        const warpCore = require('./../');

        super.fromFileJSON(jsonData, parent, TYPE);

        const newDomain = new Domain(warpCore, jsonData.name, jsonData.desc, true);
        newDomain.definitionOfMany = jsonData.definitionOfMany;
        newDomain.lastUpdated = jsonData.lastUpdated;

        newDomain.entities = jsonData.entities.map(
            (json) => Entity.fromFileJSON(json, newDomain)
        );

        newDomain.replaceOIDs();

        return newDomain;
    }

    toString() {
        var e;
        var es;
        var i;
        var s = "//\n// Domain '" + this.name + "'\n//\n";

        s += "\n// Basic Entity Definitions:\n";
        for (i in this.getEntities()) {
            e = this.getEntities()[i];
            s += e.toString("properties") + "\n";
        }

        s += "\n// Aggregation Hierarchy:\n";
        for (i in this.getEntities()) {
            e = this.getEntities()[i];
            es = e.toString("aggregations");
            if (es.length > 0) {
                s += es + "\n";
            }
        }

        s += "\n// Associations:\n";
        for (i in this.getEntities()) {
            e = this.getEntities()[i];
            es = e.toString("associations");
            if (es.length > 0) {
                s += es + "\n";
            }
        }

        return s;
    }

    createNewInstance() {
        return {
            domainName: 'UNDEFINED',
            isRootInstance: true,
            parentID: null
        };
    }

    getEntityByInstance(instance) {
        // FIXME: The type can change, for now, assuming type is the name of the
        // entity.
        return this.getEntityByName(instance.type);
    }

    getEntityById(entityId) {
        const entities = this.getEntities().filter((entity) => String(entity.id) === String(entityId));
        if (entities.length === 1) {
            return entities.pop();
        } else {
            throw new DomainError(`Cannot find entity with id=${entityId}.`);
        }
    }

    /**
     *  Retrieve all entities that are documents.
     */
    getDocumentEntities() {
        return this.getEntities().filter((entity) => entity.isDocument() && !entity.isAbstract);
    }

    /**
     *  Gets all domain defined.
     */
    static list(persistence) {
        return Promise.resolve()
            .then(() => persistence.documents(COLLECTION_NAME));
    }

    toPersistenceJSON() {
        return _.extend({}, super.toPersistenceJSON(), {
            // From constructor
            idCounter: this.idCounter,
            definitionOfMany: this.definitionOfMany,
            lastUpdated: this.lastUpdated,

            // For persistence
            id: this.persistenceId,

            // Other
            parentID: undefined, // TODO
            parentRelnID: 97,
            parentRelnName: 'Domains',
            parentBaseClassID: 2,
            parentBaseClassName: 'WarpWorks'
        });
    }

    static fromPersistenceJSON(warpCore, persistence, json) {
        return Promise.resolve()
            .then(() => new Domain(warpCore, json.name, json.description, true))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.idCounter = json.idCounter;
                    instance.definitionOfMany = json.definitionOfMany;
                    instance.lastUpdated = json.lastUpdated;
                    instance.persistenceId = json.id;
                })

                // Retrieve entities.
                .then(() => fromPersistenceCollection(persistence, instance, Entity, 'entities'))

                // Replace OIDs with real objects.
                .then(() => instance.replaceOIDs())

                .then(() => instance)
            )
        ;
    }

    /**
     *  In JSON format, in-memory references have been replaced with OIDs. Now,
     *  we must replace any of these OIDs with in-memory object references
     *  again. This method should only be called with the domain has been
     *  reconstructed from JSON.
     */
    replaceOIDs() {
        this.getEntities().forEach((entity) => {
            // Parent class
            if (entity.hasParentClass()) {
                const oid = entity.getParentClass();
                if (oid) {
                    const target = this.findElementByID(oid);
                    if (target) {
                        entity.setParentClass(target);
                    } else {
                        throw new WarpWorksError(`Cannot find parent class OID ${oid} for ${entity.name}.`);
                    }
                }
            }

            // Relationships
            entity.relationships.forEach((relationship) => {
                const oid = relationship.targetEntity && relationship.targetEntity.length ? relationship.targetEntity[0] : null;
                // debug(`replaceOIDs(): entity=${entity.name} relationship=${relationship.name} oid=${oid}`);
                if (oid) {
                    const target = this.findElementByID(oid);
                    if (target) {
                        relationship.setTargetEntity(target);
                    } else {
                        throw new WarpWorksError(`Cannot find OID ${oid} target entity for ${entity.name}.${relationship.name}`);
                    }
                }
            });

            // Table views
            entity.tableViews.forEach((tableView) => {
                tableView.tableItems.forEach((tableItem) => {
                    const oid = tableItem.hasProperty() ? tableItem.getProperty() : null;
                    if (oid) {
                        const target = this.findElementByID(oid);
                        if (target) {
                            tableItem.setProperty(target);
                        } else {
                            throw new WarpWorksError(`Cannot find property OID ${oid} for ${entity.name}.${tableView.name}.${tableItem.name}.`);
                        }
                    }
                });
            });

            // Page views
            entity.pageViews.forEach((pageView) => {
                pageView.panels.forEach((panel) => {
                    panel.relationshipPanelItems.forEach((relationshipPanelItem) => {
                        const oid = relationshipPanelItem.hasRelationship() ? relationshipPanelItem.getRelationship() : null;
                        if (oid) {
                            const target = this.findElementByID(oid);
                            if (target) {
                                relationshipPanelItem.setRelationship(target);
                            } else {
                                throw new WarpWorksError(`Cannot find OID ${oid} relationship for ${entity.name}.${pageView.name}.${panel.name}.${relationshipPanelItem.name}.`);
                            }
                        }
                    });

                    panel.basicPropertyPanelItems.forEach((basicPropertyPanelItem) => {
                        const oid = basicPropertyPanelItem.hasBasicProperty() ? basicPropertyPanelItem.getBasicProperty() : null;
                        if (oid) {
                            const target = this.findElementByID(oid);
                            if (target) {
                                basicPropertyPanelItem.setBasicProperty(target);
                            } else {
                                throw new WarpWorksError(`Cannot find OID ${oid} basic property OID ${oid} for ${entity.name}.${pageView.name}.${panel.name}.${basicPropertyPanelItem.name}.`);
                            }
                        }
                    });

                    panel.enumPanelItems.forEach((enumPanelItem) => {
                        // debug(`panel.enumPanelItems.forEach(): enumPanelItem=`, enumPanelItem);
                        const oid = enumPanelItem.enumeration;
                        const target = this.findElementByID(oid);
                        if (target) {
                            enumPanelItem.setEnumeration(target);
                        } else {
                            throw new WarpWorksError(`Cannot find enumeration OID ${oid} for ${entity.name}.${pageView.name}.${panel.name}.${enumPanelItem.name}.`);
                        }
                    });
                });
            });
        });
    }
}

module.exports = Domain;
