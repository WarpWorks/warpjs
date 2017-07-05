const Base = require('./base');

class View extends Base {
    constructor(parent, id, name, desc) {
        super("View", parent, id, name, desc);

        // Properties:
        this.label = 'text';
        this.isDefault = true;
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
            label: this.label,
            isDefault: this.isDefault
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
        this.label = json.label;
        this.isDefault = json.isDefault;
    }
}

module.exports = View;
