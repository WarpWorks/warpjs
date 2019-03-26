const extend = require('lodash/extend');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');
const ComplexTypes = require('./../complex-types');
// const debug = require('./debug')('literal');

const TYPE = ComplexTypes.Literal;

class Literal extends Base {
    constructor(enumeration, id, name, desc) {
        super(TYPE, enumeration, id, name, desc);
        this.position = null;
        this.icon = null;
    }

    // eslint-disable-next-line camelcase
    getParent_Enumeration() {
        return this.parent;
    }

    toString() {
        return `${this.name}@${this.id}`;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            position: this.position,
            icon: this.icon
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.position = json.position;
        this.icon = json.icon;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new Literal(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
            position: this.position,
            icon: this.icon
        });
    }

    toFormResource(persistence, instance, docLevel, selectedValue) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            selected: (selectedValue === this.name) || undefined,
            docLevel: docLevel.join('.')
        }));

        return resource;
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, selectedValue) {
        return warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            selected: (selectedValue === this.name) || undefined,
            docLevel: docLevel.toString()
        }));
    }

    newInstance() {
        return this.name;
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            position: this.position,
            icon: this.icon
        });

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

        this.position = json.position;
        this.icon = json.icon;

        return this;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        // debug(`instantiateFromPersistenceJSON(): json=`, json);
        const instance = new Literal(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }
}

module.exports = Literal;
