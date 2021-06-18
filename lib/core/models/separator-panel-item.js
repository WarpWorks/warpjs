const extend = require('lodash/extend');
const warpjsUtils = require('@warp-works/warpjs-utils');

const ComplexTypes = require('./../complex-types');
const PanelItem = require('./panel-item');

const TYPE = ComplexTypes.SeparatorPanelItem;

class SeparatorPanelItem extends PanelItem {
    constructor(parent, id, position) {
        const name = "Separator";
        const desc = "---------";
        super(TYPE, parent, id, name, desc, position);
    }

    toString() {
        return `${this.name}; `;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
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
        return extend({}, super.toFormResourceBase(), {
        });
    }

    toFormResource(persistence, instance, docLevel) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.join('.')
        }));

        return resource;
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.toString()
        }));

        return resource;
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
        });

        return json;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new SeparatorPanelItem(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }
}

module.exports = SeparatorPanelItem;
