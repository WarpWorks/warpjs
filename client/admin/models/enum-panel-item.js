const PanelItem = require('./panel-item');

class EnumPanelItem extends PanelItem {
    constructor(parent, id, name, desc) {
        super(parent, id, name, desc);

        // Relationships:
        this.enumeration = [];
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
        var jsonEnumeration = [];
        for (let i in this.enumeration) {
            jsonEnumeration.push(this.enumeration[i].id);
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            enumeration: jsonEnumeration
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

        this.enumeration = json.enumeration; // Currently only works for *unary* associations!
    }
}

module.exports = EnumPanelItem;
