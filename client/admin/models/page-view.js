const Panel = require('./panel');
const View = require('./view');

class PageView extends View {
    constructor(parent, id, name, desc) {
        super(parent, id, name, desc);

        // Relationships:
        this.panels = [];
    }

    // Manage Aggregations:
    addNew_Panel(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var newPanel = new Panel(this, id, name, desc);
        newPanel.type = "Panel";
        this.panels.push(newPanel);
        return newPanel;
    }

    remove_Panel(id) {
        var idx = -1;
        this.panels.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.panels.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    // Misc utility functions
    getAllElements(includeSelf) {
        var r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        for (let i in this.panels) {
            r = r.concat(this.panels[i].getAllElements(true));
        }
        return r;
    }

    toJSON() {
        // Get JSON for aggregated entities:
        var jasonPanels = [];
        for (let i in this.panels) {
            jasonPanels.push(this.panels[i].toJSON());
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            label: this.label,
            isDefault: this.isDefault,
            panels: jasonPanels
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

        for (var i in json.panels) {
            var jsElem = json.panels[i];
            var newElem = this.addNew_Panel(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
    }
}

module.exports = PageView;
