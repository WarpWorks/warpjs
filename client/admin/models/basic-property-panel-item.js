const PanelItem = require('./panel-item');

class BasicPropertyPanelItem extends PanelItem {
    constructor(parent, id, name, desc) {
        super(parent, id, name, desc);

        // Relationships:
        this.basicProperty = [];
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
        var jsonBasicProperty = [];
        for (let i in this.basicProperty) {
            jsonBasicProperty.push(this.basicProperty[i].id);
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            basicProperty: jsonBasicProperty
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

        this.basicProperty = json.basicProperty; // Currently only works for *unary* associations!
    }
}

module.exports = BasicPropertyPanelItem;
