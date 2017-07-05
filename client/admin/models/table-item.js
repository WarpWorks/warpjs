const Base = require('./base');

class TableItem extends Base {
    constructor(parent, id, name, desc) {
        super("TableItem", parent, id, name, desc);

        // Properties:
        this.position = 0;
        this.label = 'text';

        // Relationships:
        this.property = [];
    }

    // Misc utility functions
    getAllElements(includeSelf) {
        var r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        return r;
    }

    toJSON() {
    // Get JSON for associations:
        var jsonProperty = [];
        for (let i in this.property) {
            jsonProperty.push(this.property[i].id);
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            property: jsonProperty
        };
    }

    fromJSON(json, parent) {
    // Base attibutes:
        this.parent = parent;
        this.name = json.name;
        this.desc = json.desc;
        this.type = json.type;
        this.id = json.id;
        // Basic Properties:
        this.position = json.position;
        this.label = json.label;

        this.property = json.property; // Currently only works for *unary* associations!
    }
}

module.exports = TableItem;
