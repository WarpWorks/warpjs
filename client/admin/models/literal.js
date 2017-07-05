const Base = require('./base');

class Literal extends Base {
    constructor(parent, id, name, desc) {
        super("Literal", parent, id, name, desc);

        // Properties:
        this.position = 'text';
        this.icon = 'text';
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
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            icon: this.icon
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
        this.icon = json.icon;
    }
}

module.exports = Literal;
