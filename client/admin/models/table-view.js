const TableItem = require('./table-item');
const View = require('./view');

class TableView extends View {
    constructor(parent, id, name, desc) {
        super(parent, id, name, desc);

        // Relationships:
        this.tableItems = [];
    }

    //
    // Manage Aggregations:
    addNew_TableItem(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var newTableItems = new TableItem(this, id, name, desc);
        newTableItems.type = "TableItem";
        this.tableItems.push(newTableItems);
        return newTableItems;
    }

    remove_TableItem(id) {
        var idx = -1;
        this.tableItems.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.tableItems.splice(idx, 1);
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
        for (let i in this.tableItems) {
            r = r.concat(this.tableItems[i].getAllElements(true));
        }
        return r;
    }

    toJSON() {
        // Get JSON for aggregated entities:
        var jsonTableItems = [];
        for (let i in this.tableItems) {
            jsonTableItems.push(this.tableItems[i].toJSON());
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            label: this.label,
            isDefault: this.isDefault,
            tableItems: jsonTableItems
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

        for (var i in json.tableItems) {
            var jsElem = json.tableItems[i];
            var newElem = this.addNew_TableItem(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
    }
}

module.exports = TableView;
