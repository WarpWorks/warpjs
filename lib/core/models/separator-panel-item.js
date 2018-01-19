const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
const PanelItem = require('./panel-item');

const TYPE = ComplexTypes.SeparatorPanelItem;

class SeparatorPanelItem extends PanelItem {
    constructor(parent, id, position) {
        var name = "Separator";
        var desc = "---------";
        super(TYPE, parent, id, name, desc, position);
    }

    toString() {
        return this.name + "; ";
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        // no-op
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new SeparatorPanelItem(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toFormResourceBase() {
        return _.extend({}, super.toFormResourceBase(), {
        });
    }

    toFormResource(persistence, instance, docLevel) {
        const resource = warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.join('.')
        }));

        return resource;
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                docLevel: docLevel.join('.')
            })))
            .then((resource) => Promise.resolve()
                .then(() => resource)
            )
        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
        });

        return json;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new SeparatorPanelItem(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }
}

module.exports = SeparatorPanelItem;
