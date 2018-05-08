const _ = require('lodash');
// const debug = require('debug')('W2:models:literal');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');
const ComplexTypes = require('./../complex-types');

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
        return this.name;
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
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
        return _.extend({}, super.toFormResourceBase(), {
            position: this.position,
            icon: this.icon
        });
    }

    toFormResource(persistence, instance, docLevel, selectedValue) {
        const resource = warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
            selected: (selectedValue === this.name) || undefined,
            docLevel: docLevel.join('.')
        }));

        return resource;
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, selectedValue) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                selected: (selectedValue === this.name) || undefined,
                docLevel: docLevel.toString()
            })))
            .then((resource) => Promise.resolve()
                .then(() => resource)
            )
        ;
    }

    newInstance() {
        return this.name;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            position: this.position,
            icon: this.icon
        });

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.position = json.position;
                this.icon = json.icon;
            })
            .then(() => this)
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        // debug(`instantiateFromPersistenceJSON(): json=`, json);
        return Promise.resolve()
            .then(() => new Literal(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }
}

module.exports = Literal;
