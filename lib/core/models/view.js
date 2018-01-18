const _ = require('lodash');
const Promise = require('bluebird');

const Action = require('./action');
const Base = require('./base');
const utils = require('./../utils');

class View extends Base {
    constructor(type, parent, id, name, desc) {
        super(type, parent, id, name, desc);
        this.isDefault = false;
        this.label = name;
        this.persistenceId = null;
        this.actions = [];
    }

    // eslint-disable-next-line camelcase
    getParent_Entity() {
        return this.parent;
    }

    getActions() {
        return this.actions;
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
            isDefault: this.isDefault,
            label: this.label,
            persistenceId: this.persistenceId,
            actions: utils.mapJSON(this.actions)
        });
    }

    fromJSON(json) {
        super.fromJSON(json);
        this.isDefault = json.isDefault;
        this.label = json.label;
        this.persistenceId = json.persistenceId;
        this.actions = this.fromJsonMapper(Action, json.actions);
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            isDefault: this.isDefault,
            label: this.label,
            id: this.persistenceId,
            lastUpdated: this.lastUpdated
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(65, 'actions', this.getActions()));

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.isDefault = json.isDefault;
                this.label = json.label;
                this.persistenceId = json.id;
            })
            .then(() => this)
        ;
    }

    toFormResourceBase() {
        return _.extend({}, super.toFormResourceBase(), {
            isDefault: this.isDefault,
            label: this.label
        });
    }
}

module.exports = View;
