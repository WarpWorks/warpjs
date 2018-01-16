// const debug = require('debug')('W2:models:base');
const Promise = require('bluebird');

const ComplexTypes = require('./../complex-types');
const getTopNonAbstractClassName = require('./../get-top-non-abstract-class-name');
const isValidModelId = require('./../is-valid-model-id');
const isValidModelName = require('./../is-valid-model-name');
const WarpWorksError = require('./../error');

const SCHEMA_ID_SEPARATOR = '-';

class Base {
    constructor(type, parent, id, name, desc) {
        // Set basic attributes first (needed for validation below)
        this.type = type;
        this.parent = parent;
        this.id = id;
        this.name = name ? name.replace(/ /g, '') : name; // Remove whitespaces
        this.desc = desc;

        // Validate name
        if (!isValidModelName(this.name)) {
            throw new Error("Invalid name: '" + name + "'. Please use only a-z, A-Z, 0-9 or _!");
        }

        /* TBD: Decide if we want to enforce unique names within a domain?
        const duplicate = this.getDomain().findElementByName(name);
        if (duplicate && duplicate != this)
            throw "Error creating element of type '"+type+"'! Name '"+name+"' already used by element of type '"+duplicate.type+"' in same domain!";
        */

        // This is the top-level element; it will be resolved dynamically
        this.warpworks = (parent && parent.constructor.name === 'WarpWorks') ? parent : null;
    }

    toJSON() {
        return {
            type: this.type,
            id: this.idToJSON(),
            name: this.name,
            desc: this.desc
        };
    }

    // Sets inherited props.
    fromJSON(json) {
        // No-op.
    }

    fromJsonMapper(Model, items) {
        return (items || []).map((json) => Model.fromFileJSON(json, this));
    }

    static validateFromFileJSON(jsonData, expectedType) {
        if (!jsonData.name) {
            throw new WarpWorksError(`No name specified for type='${jsonData.type}'!`);
        }

        if (jsonData.type !== expectedType) {
            throw new WarpWorksError(`Element '${jsonData.name}' of type '${jsonData.type}', but expected type '${expectedType}'!`);
        }

        if (!isValidModelId(jsonData.id)) {
            throw new WarpWorksError(`Element '${jsonData.name}' has invalid id='${jsonData.id}'!`);
        }
    }

    toPersistenceJSON() {
        return {
            type: this.type,
            warpjsId: this.idToJSON(),
            name: this.name,
            desc: this.desc
        };
    }

    mapChildrenPersistenceJSON(parentRelnID, parentRelnName, children) {
        return {
            parentRelnID,
            parentRelnName,
            entities: (children || []).map((child) => child.toPersistenceJSON())
        };
    }

    static validatePersistenceJSON(json, expectedType) {
        if (!json.type) {
            throw new WarpWorksError(`Missing type in json=${JSON.stringify(json, null, 2)}!`);
        }

        if (!json.name) {
            throw new WarpWorksError(`Missing name for entity type='${json.type}'!`);
        }

        if (json.type !== expectedType) {
            throw new WarpWorksError(`Element '${json.name}' of type '${json.type}', but expected type '${expectedType}'!`);
        }

        if (!isValidModelId(json.warpjsId)) {
            throw new WarpWorksError(`Element '${json.name}' has invalid id='${json.warpjsId}'!`);
        }
    }

    getWarpWorks() {
        if (!this.warpworks) {
            this.warpworks = this.parent.getWarpWorks();
        }
        return this.warpworks;
    }

    getDomain() {
        if (this.type !== ComplexTypes.Domain) {
            return this.parent.getDomain();
        }
        return this;
    }

    isOfType(t) {
        return this.type === t;
    }

    compareToMyID(id) {
        return this.getDomain().compareIDs(this.id, id);
    }

    idToJSON() {
        return this.id;
    }

    findElementByID(id) {
        return this.getAllElements(true).find((element) => this.getDomain().compareIDs(id, element.id)) || null;
    }

    findElementByName(name, type) {
        return this.getAllElements(true).find((element) => (element.name === name) && (!type || element.type === type)) || null;
    }

    getParent(persistence, instance) {
        return Promise.resolve()
            .then(() => this.getDomain().getParentEntityByParentBaseClassName(instance))
            .then((parentEntity) => {
                if (parentEntity) {
                    return parentEntity.getInstance(persistence, instance.parentID)
                        .then((parentInstance) => {
                            return {
                                entity: parentEntity,
                                instance: parentInstance
                            };
                        });
                }
                return {
                    entity: parentEntity,
                    instance: null
                };
            });
    }

    getPath() {
        return (this.parent ? this.parent.getPath() : '') + `/${this.name}`;
    }

    getInstancePath(persistence, instance) {
        return Promise.resolve()
            .then(() => this.getParent(persistence, instance))
            .then((parent) => {
                if (parent && parent.instance) {
                    return parent.entity.getInstancePath(persistence, parent.instance);
                }
                return [];
            })
            .then((ancestors) => ancestors.concat({
                type: this.name,
                id: instance.id,
                name: instance.Name || this.name,
                displayType: this.desc
            }))
        ;
    }

    getInstance(persistence, id) {
        const name = getTopNonAbstractClassName(this);
        return persistence.findOne(name, id, true);
    }

    getDocuments(persistence, query, withCount) {
        const name = getTopNonAbstractClassName(this);
        return persistence.documents(name, query, withCount);
    }

    /**
     *  Gets all children of the given parent.
     *
     *  @param {objec} persistence: Persistance instance.
     *  @param {string|object} parentData: Search criteria. If a string, it's
     *      expected to be the `parentID`.
     *  @returns {Promise} The list of documents for a given parent.
     */
    getChildren(persistence, parentData) {
        if (typeof parentData === 'string') {
            return persistence.documents(this.name, { parentID: parentData }, true);
        }
        return persistence.documents(this.name, parentData, true);
    }

    getDisplayName(instance) {
        const name = (instance.Name || instance.name || "").trim();
        return name || `${instance.type}[${instance.id || instance._id}]`;
    }

    get schemaId() {
        // FIXME: When we get the new uniq id concept, just return it here.
        return [this.name, this.id].join(SCHEMA_ID_SEPARATOR);
    }

    fromSchemaId(value) {
        // FIXME: When we get the new uniq id concept, just return it here.
        return value.split(SCHEMA_ID_SEPARATOR).pop();
    }
}

module.exports = Base;
