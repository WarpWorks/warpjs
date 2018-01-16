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
        const json = _.extend({}, super.toPersistenceJSON(), {
            position: this.position,
            label: this.label,
            readOnly: this.readOnly
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(80, 'actions', this.actions));

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.position = json.position;
                this.label = json.label;
                this.readOnly = json.readOnly;
            })
            .then(() => this.fromPersistenceEmbeddedJson(persistence, json.embedded, 80, Action, 'actions'))
            .then(() => this)
        ;
    }
}

module.exports = PanelItem;
