const Base = require('./base');

class Action extends Base {
    constructor(parent, id, name, desc) {
        super("Action", parent, id, name, desc);

        // Properties:
        this.icon = 'text';
        this.label = 'text';
        this.functionName = 'text';
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
            icon: this.icon,
            label: this.label,
            functionName: this.functionName
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
        this.icon = json.icon;
        this.label = json.label;
        this.functionName = json.functionName;
    }
}

module.exports = Action;
