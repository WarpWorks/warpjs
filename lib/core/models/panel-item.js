const _ = require('lodash');

const Action = require('./action');
const Base = require('./base');
class PanelItem extends Base {
    constructor(type, parent, id, name, desc, position) {
        super(type, parent, id, name, desc);
        this.position = position || -1;
        this.label = name;
        this.readOnly = false;
        this.actions = [];
    }

    // eslint-disable-next-line camelcase
    getParent_Panel() {
        return this.parent;
    }

    get isReadOnly() {
        return Boolean(this.readOnly);
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
            position: this.position,
            label: this.label,
            readOnly: this.readOnly,

            actions: this.actions.map((action) => action.toJSON())
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.position = json.position;
        this.label = json.label;
        this.readOnly = json.readOnly;

        this.actions = this.fromJsonMapper(Action, json.actions);
    }

    toPersistenceJSON() {
        return _.extend({}, super.toPersistenceJSON(), {
            position: this.position,
            label: this.label,
            readOnly: this.readOnly,

            embedded: [
                this.mapChildrenPersistenceJSON(80, 'actions', this.actions)
            ]
        });
    }
}

module.exports = PanelItem;
