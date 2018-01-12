const _ = require('lodash');
const Base = require('./base');
const ComplexTypes = require('./../complex-types');

const TYPE = ComplexTypes.TableItem;

class TableItem extends Base {
    constructor(parent, id, name, desc, property) {
        super(TYPE, parent, id, name, desc);

        // TBD: Property must be of type "property"
        // TBD: Also, only allow for properties of the current Entity
        this.property = [property];
        this.label = name;
    }

    // eslint-disable-next-line camelcase
    getParent_TableView() {
        return this.parent;
    }

    hasProperty() {
        return this.property && this.property.length > 0 && this.property[0] != null;
    }

    getProperty() {
        return this.property[0];
    }

    setProperty(p) {
        this.property = [p];
    }

    toString() {
        return this.name + "[=>" + (this.hasProperty() ? this.getProperty().name : "undefined") + "]; ";
    }

    toJSON() {
        return _.extend({}, super.toJSON(), {
            position: this.position,
            label: this.label,
            property: this.hasProperty() ? [this.getProperty().idToJSON()] : []
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.position = json.position;
        this.label = json.label;
        this.property = json.property;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new TableItem(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toPersistenceJSON() {
        return _.extend({}, super.toPersistenceJSON(), {
            position: this.position,
            label: this.label
        });
    }

    static fromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new TableItem(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.position = json.position;
                    instance.label = json.label;
                })
                .then(() => instance)
            )
        ;
    }
}

module.exports = TableItem;
