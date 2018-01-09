const Base = require('./base');

const TYPE = 'TableItem';

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
        var p = this.hasProperty() ? [this.getProperty().idToJSON()] : [];
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            property: p
        };
    }

    static fromJSON(parent, jsonData) {
        const instance = new TableItem(parent, jsonData.id, jsonData.name, jsonData.desc);
        instance.position = jsonData.position;
        instance.label = jsonData.label;
        instance.property = jsonData.property;
        return instance;
    }

    toPersistenceJSON() {
        return {
            type: this.type,
            name: this.name,
            description: this.desc,
            position: this.position,
            label: this.label,

            warpjsId: this.idToJSON(),
            id: this.persistenceId,

            embedded: []
        };
    }
}

module.exports = TableItem;
