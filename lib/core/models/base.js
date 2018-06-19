const _ = require('lodash');
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
        this.name = (name || '').replace(/\W/g, '');
        this.desc = desc;
        this.label = this.name.replace(/([a-z])([A-Z])/g, '$1 $2').trim();

        // Validate name
        // FIXME: We should not need this anymore since we .replace() above.
        if (!isValidModelName(this.name)) {
            throw new Error(`Invalid name: '${name}'. Please use only a-z, A-Z, or 0-9!`);
        }

        // This is the top-level element; it will be resolved dynamically
        this.warpworks = (parent && parent.constructor.name === 'WarpWorks') ? parent : null;
    }

    toJSON() {
        return {
            type: this.type,
            typeID: this.typeID,
            id: this.idToJSON(),
            name: this.name,
            desc: this.desc,
            label: this.label
        };
    }

    toString() {
        throw new WarpWorksError(`Implementation '${this.constructor.name}.toString()' missing.`);
    }

    // Sets inherited props.
    fromJSON(json) {
        this.typeID = json.typeID;
        this.label = json.label;
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
            typeID: this.typeID,
            warpjsId: this.idToJSON(),
            name: this.name,
            desc: this.desc,
            label: this.label,
            embedded: []
        };
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => {
                this.typeID = json ? json.typeID : null;
                this.label = json ? json.label : null;
            })
        ;
    }

    /**
     *  This method is used to import the schema for the first time.
     */
    save(persistence, parentID) {
        return Promise.resolve()
            .then(() => this.toPersistenceJSON())
            .then((json) => _.extend({}, json, {
                parentID,
                lastUpdated: (new Date()).toISOString()
            }))
            .then((json) => persistence.save(this.type, json))
            .then((saveResult) => saveResult.id)
        ;
    }

    fromPersistenceCollection(persistence, Model, prop) {
        return Promise.resolve()
            .then(() => Model.getPersistenceDocuments(persistence, this.persistenceId))
            .then((documents) => Promise.map(
                documents,
                (doc) => Model.instantiateFromPersistenceJSON(persistence, doc, this)
            ))
            .then((elements) => {
                this[prop] = elements;
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(`Error extracting child documents for Model=${Model.name}: err=`, err);
                throw err;
            })
        ;
    }

    fromPersistenceEmbeddedJson(persistence, embedded, parentRelnID, Model, prop) {
        return Promise.resolve()
            .then(() => (embedded || []).find((embed) => embed.parentRelnID === parentRelnID))
            .then((embed) => embed ? embed.entities : [])
            .then((entities) => Promise.map(
                entities,
                (json) => Model.instantiateFromPersistenceJSON(persistence, json, this)
            ))
            .then((values) => {
                this[prop] = values;
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(`Error for Model=${Model.name}: ${err.message}`);
                throw err;
            })
        ;
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
            return this.parent && this.parent.getDomain ? this.parent.getDomain() : null;
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
                typeID: this.id,
                id: instance.id,
                name: instance.Name || instance.name || this.name,
                displayType: this.getDisplayName(this)
            }))
        ;
    }

    getInstance(persistence, id) {
        const name = getTopNonAbstractClassName(this);
        return persistence.findOne(name, id, true);
    }

    getDocuments(persistence, query, convertId) {
        const name = getTopNonAbstractClassName(this);
        return persistence.documents(name, query, convertId);
    }

    getDisplayName(instance) {
        if (instance.type === 'Paragraph' && instance.Heading) {
            return instance.Heading;
        }

        if (instance.type === 'Image' && instance.Caption) {
            return instance.Caption;
        }

        if (instance.type === 'ImageArea' && (instance.Title || (instance.Shape && instance.Coords))) {
            return instance.Title || `${instance.Shape}[${instance.Coords}]`;
        }

        if (instance.type === 'Account' && instance.UserName) {
            return instance.UserName;
        }

        const name = (instance.label || instance.Name || instance.name || "").trim();

        if (name) {
            return name;
        }

        if (instance.Position !== "" && instance.Position !== undefined) {
            return `${instance.type}[Position:${instance.Position}]`;
        }

        return `${instance.type}[ID:${instance.id || instance._id}]`;
    }

    get schemaId() {
        // FIXME: When we get the new uniq id concept, just return it here.
        return [this.name, this.id].join(SCHEMA_ID_SEPARATOR);
    }

    fromSchemaId(value) {
        // FIXME: When we get the new uniq id concept, just return it here.
        return value.split(SCHEMA_ID_SEPARATOR).pop();
    }

    toFormResourceBase() {
        return {
            id: this.idToJSON(),
            type: this.type,
            typeID: this.typeID,
            name: this.name,
            desc: this.desc,
            label: this.label
        };
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        throw new Error(`${this.constructor.name}.toFormResource() not implemented!`);
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        throw new Error(`${this.constructor.name}.toStudioResource() not implemented!`);
    }
}

module.exports = Base;
