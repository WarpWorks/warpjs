const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const ComplexTypes = require('./../complex-types');
const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
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

    toFormResource(persistence, instance, docLevel) {
        const resource = warpjsUtils.createResource('', {
            type: this.type,
            name: this.name,
            id: this.idToJSON(),
            desc: this.desc,
            label: this.label,
            position: this.position,
            readOnly: this.readOnly,
            docLevel: docLevel.join('.')
        });

        return resource;
    }

    toPersistenceJSON() {
        return _.extend({}, super.toPersistenceJSON(), {
            position: this.position,
            label: this.label,
            readOnly: this.readOnly,

            embedded: [{
                parentRelnID: 80,
                parentRelnName: 'actions',
                entities: this.actions.map((action) => action.toPersistenceJSON())
            }]
        });
    }

    static fromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new SeparatorPanelItem(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.position = json.position;
                    instance.label = json.label;
                    instance.readOnly = json.readOnly;
                })

                .then(() => fromPersistenceEmbeddedJson(persistence, instance, json.embedded, 80, Action, 'actions'))

                .then(() => instance)
            )
        ;
    }
}

module.exports = SeparatorPanelItem;
