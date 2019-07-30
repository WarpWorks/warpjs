const extend = require('lodash/extend');
const Promise = require('bluebird');

const ComplexTypes = require('./../complex-types');
const { DEFAULT_VERSION } = require('./../../constants');
// const debug = require('./debug')('base');
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
            throw new Error(`Invalid name: '${name}' for [type:${type}, id=${id}]. Please use only a-z, A-Z, or 0-9!`);
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
            typeID: this.typeID || this.id,
            warpjsId: this.idToJSON(),
            name: this.name,
            desc: this.desc,
            label: this.label,
            embedded: []
        };
    }

    async fromPersistenceJSON(persistence, json) {
        // debug(`${this.constructor.name}.fromPersistenceJSON(): json=`, json);
        this.typeID = json ? json.typeID : null;
        this.label = json ? json.label : null;
    }

    /**
     *  This method is used to import the schema for the first time, and when a
     *  schema is updated. This will call the `this.toPersistenceJSON()`.
     */
    async save(persistence, parentID) {
        const json = extend({}, this.toPersistenceJSON(), {
            parentID,
            lastUpdated: (new Date()).toISOString()
        });
        if (json.id) {
            await persistence.update(this.type, json);
            return json.id;
        } else {
            const saveResult = await persistence.save(this.type, json);
            return saveResult.id;
        }
    }

    /**
     *  Used to update an existing schema.
     */
    async updateSchema(persistence) {
        const json = extend({}, this.toPersistenceJSON(), {
            lastUpdated: (new Date()).toISOString()
        });
        await persistence.update(this.type, json);
    }

    async fromPersistenceCollection(persistence, Model, prop) {
        try {
            const documents = await Model.getPersistenceDocuments(persistence, this.persistenceId);
            const elements = await Promise.map(
                documents,
                (doc) => Model.instantiateFromPersistenceJSON(persistence, doc, this)
            );

            this[prop] = elements;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error extracting child documents for Model=${Model.name}: err=`, err);
            throw err;
        }
    }

    async fromPersistenceEmbeddedJson(persistence, embedded, parentRelnID, Model, prop) {
        try {
            const embed = (embedded || []).find((embed) => embed.parentRelnID === parentRelnID);
            const entities = embed ? embed.entities : [];
            const values = await Promise.map(
                entities,
                (json) => Model.instantiateFromPersistenceJSON(persistence, json, this)
            );
            this[prop] = values;
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error for Model=${Model.name}: ${err.message}`);
            throw err;
        }
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

    hasParentInstance(instance) {
        return Boolean(instance.parentBaseClassID && instance.parentID);
    }

    /**
     *  Returns the data if the instance has a parent document, or `null`
     *  otherwise. The data is an object `{entity, instance}`.
     */
    async getParentData(persistence, instance) {
        if (this.hasParentInstance(instance)) {
            const domain = await this.getDomain();
            const parentEntity = domain.getEntityById(instance.parentBaseClassID);
            const parentInstances = await parentEntity.getDocuments(persistence, { _id: instance.parentID }, true);
            const parentInstance = parentInstances.pop();

            if (parentInstance) {
                return Object.freeze({
                    entity: parentEntity,
                    instance: parentInstance
                });
            }
        }
        return null;
    }

    async getParent(persistence, instance) {
        const parentEntity = await this.getDomain().getParentEntityByParentBaseClassID(instance);

        if (parentEntity) {
            const parentInstance = await parentEntity.getInstance(persistence, instance.parentID);

            return {
                entity: parentEntity,
                instance: parentInstance
            };
        }
        return {
            entity: parentEntity,
            instance: null
        };
    }

    getPath() {
        return (this.parent ? this.parent.getPath() : '') + `/${this.name}`;
    }

    async getInstancePath(persistence, instance) {
        const parent = await this.getParent(persistence, instance);
        const ancestors = (parent && parent.instance)
            ? await parent.entity.getInstancePath(persistence, parent.instance)
            : []
        ;

        return ancestors.concat({
            type: this.name,
            typeID: this.id,
            id: instance.id,
            name: instance.Name || instance.name || this.name,
            displayType: this.getDisplayName(this),
            version: instance.Version || DEFAULT_VERSION
        });
    }

    getInstance(persistence, id) {
        const name = getTopNonAbstractClassName(this);
        return persistence.findOne(name, id);
    }

    getDocuments(persistence, query, convertId) {
        const name = getTopNonAbstractClassName(this);
        return persistence.documents(name, query, convertId);
    }

    getDisplayName(instance) {
        let name;

        if (instance.type === 'Paragraph' && instance.Heading) {
            name = instance.Heading;
        } else if (instance.type === 'Image' && instance.Caption) {
            name = instance.Caption;
        } else if (instance.type === 'ImageArea' && (instance.Title || (instance.Shape && instance.Coords))) {
            name = instance.Title || `${instance.Shape}[${instance.Coords}]`;
        } else if (instance.type === 'Account' && instance.UserName) {
            name = instance.UserName.trim();
        } else {
            name = instance.label || instance.Name || instance.name || "";
        }

        name = name.trim();

        if (name) {
            return name;
        } else if (instance.Position !== "" && instance.Position !== undefined) {
            return `${instance.type}[Position:${instance.Position}]`;
        } else {
            return `${instance.type}[ID:${instance.id || instance._id}]`;
        }
    }

    get schemaId() {
        // FIXME: When we get the new uniq id concept, just return it here.
        return [ this.name, this.id ].join(SCHEMA_ID_SEPARATOR);
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
            label: this.label || this.name
        };
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        throw new Error(`${this.constructor.name}.toFormResource() not implemented!`);
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        throw new Error(`${this.constructor.name}.toStudioResource() not implemented!`);
    }

    getInstanceId(instance) {
        return instance._id || instance.id;
    }
}

module.exports = Base;
