const extend = require('lodash/extend');
const uuid = require('uuid/v4');

const Action = require('./action');
const Base = require('./base');

class PanelItem extends Base {
    constructor(type, parent, id, name, desc, position) {
        super(type, parent, id, name, desc);
        this.position = position || -1;
        this.readOnly = false;
        this.actions = [];
        this.visibleInEditOnly = false;
    }

    // eslint-disable-next-line camelcase
    getParent_Panel() {
        return this.parent;
    }

    get isReadOnly() {
        return Boolean(this.readOnly);
    }

    get isVisibleInEditOnly() {
        return Boolean(this.visibleInEditOnly);
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            position: this.position,
            readOnly: this.readOnly,
            visibleInEditOnly: this.visibleInEditOnly,

            actions: this.actions.map((action) => action.toJSON())
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.position = json.position;
        this.readOnly = json.readOnly;
        this.visibleInEditOnly = json.visibleInEditOnly;

        this.actions = this.fromJsonMapper(Action, json.actions);
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            _id: this._id || uuid(),
            position: this.position,
            readOnly: this.readOnly,
            visibleInEditOnly: this.visibleInEditOnly
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(80, 'actions', this.actions));

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

        this._id = json._id;
        this.position = json.position;
        this.readOnly = json.readOnly;
        this.visibleInEditOnly = json.visibleInEditOnly;

        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 80, Action, 'actions');

        return this;
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
            position: this.position,
            readOnly: this.readOnly,
            visibleInEditOnly: this.visibleInEditOnly
        });
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        throw new Error(`${this.constructor.name}.toStudioResource() not implemented.`);
    }
}

module.exports = PanelItem;
