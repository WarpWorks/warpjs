const PanelItem = require('./panel-item');

class RelationshipPanelItem extends PanelItem {
    constructor(parent, id, name, desc) {
        super(parent, id, name, desc);

        // Enumerations:
        this.style = "";

        // Relationships:
        this.relationship = [];
    }

    // Definitions for Enumerations
    // RelationshipPanelItem.prototype.enumDef_style = ["CSV", "Table", "Preview"];

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
        var jsonRelationship = [];
        for (let i in this.relationship) {
            jsonRelationship.push(this.relationship[i].id);
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            style: this.style,
            relationship: jsonRelationship
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
        // Enumerations:
        this.style = json.style;

        this.relationship = json.relationship; // Currently only works for *unary* associations!
    }
}

module.exports = RelationshipPanelItem;
