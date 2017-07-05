const PanelItem = require('./panel-item');

class SeparatorPanelItem extends PanelItem {
    // constructor(parent, id, name, desc) {
    //     super(parent, id, name, desc);
    // }

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
            label: this.label
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
    }
}

module.exports = SeparatorPanelItem;
