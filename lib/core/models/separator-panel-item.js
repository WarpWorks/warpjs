const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
const PanelItem = require('./panel-item');

const TYPE = 'SeparatorPanelItem';

class SeparatorPanelItem extends PanelItem {
    constructor(parent, id, position) {
        var name = "Separator";
        var desc = "---------";
        super(TYPE, parent, id, name, desc, position);
        this.label = "";
        this.readOnly = false;
        this.actions = [];
    }

    toString() {
        return this.name + "; ";
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            position: this.position,
            label: this.label,
            readOnly: this.readOnly,
            id: this.idToJSON()
        };
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
        return {
            type: this.type,
            name: this.name,
            description: this.desc,
            position: this.position,
            label: this.label,
            readOnly: this.readOnly,

            warpjsId: this.idToJSON(),

            embedded: [{
                parentRelnID: 80,
                parentRelnName: 'actions',
                entities: this.actions.map((action) => action.toPersistenceJSON())
            }]
        };
    }

    static fromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new SeparatorPanelItem(parent, json.warpjsId, json.name, json.description))
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
