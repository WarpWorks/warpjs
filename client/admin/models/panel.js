const Action = require('./action');
const Base = require('./base');
const BasicPropertyPanelItem = require('./basic-property-panel-item');
const EnumPanelItem = require('./enum-panel-item');
const RelationshipPanelItem = require('./relationship-panel-item');
const SeparatorPanelItem = require('./separator-panel-item');

class Panel extends Base {
    constructor(parent, id, name, desc) {
        super("Panel", parent, id, name, desc);

        // Properties:
        this.position = 0;
        this.label = 'text';
        this.columns = 0;
        this.alternatingColors = true;

        // Relationships:
        this.separatorPanelItems = [];
        this.relationshipPanelItems = [];
        this.basicPropertyPanelItems = [];
        this.enumPanelItems = [];
        this.actions = [];
    }

    // Manage Aggregations:
    addNew_SeparatorPanelItem(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var new_separatorPanelItems = new SeparatorPanelItem(this, id, name, desc);
        new_separatorPanelItems.type = "SeparatorPanelItem";
        this.separatorPanelItems.push(new_separatorPanelItems);
        return new_separatorPanelItems;
    }

    remove_SeparatorPanelItem(id) {
        var idx = -1;
        this.separatorPanelItems.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.separatorPanelItems.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    addNew_RelationshipPanelItem(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var new_relationshipPanelItems = new RelationshipPanelItem(this, id, name, desc);
        new_relationshipPanelItems.type = "RelationshipPanelItem";
        this.relationshipPanelItems.push(new_relationshipPanelItems);
        return new_relationshipPanelItems;
    }

    remove_RelationshipPanelItem(id) {
        var idx = -1;
        this.relationshipPanelItems.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.relationshipPanelItems.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    addNew_BasicPropertyPanelItem(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var new_basicPropertyPanelItems = new BasicPropertyPanelItem(this, id, name, desc);
        new_basicPropertyPanelItems.type = "BasicPropertyPanelItem";
        this.basicPropertyPanelItems.push(new_basicPropertyPanelItems);
        return new_basicPropertyPanelItems;
    }

    remove_BasicPropertyPanelItem(id) {
        var idx = -1;
        this.basicPropertyPanelItems.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.basicPropertyPanelItems.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    addNew_EnumPanelItem(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var new_enumPanelItems = new EnumPanelItem(this, id, name, desc);
        new_enumPanelItems.type = "EnumPanelItem";
        this.enumPanelItems.push(new_enumPanelItems);
        return new_enumPanelItems;
    }

    remove_EnumPanelItem(id) {
        var idx = -1;
        this.enumPanelItems.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.enumPanelItems.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    addNew_Action(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var new_actions = new Action(this, id, name, desc);
        new_actions.type = "Action";
        this.actions.push(new_actions);
        return new_actions;
    }

    remove_Action(id) {
        var idx = -1;
        this.actions.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.actions.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    // Misc utility functions
    getAllElements(includeSelf) {
        let i;
        var r = [];

        if (includeSelf) {
            r = r.concat(this);
        }
        for (i in this.separatorPanelItems) {
            r = r.concat(this.separatorPanelItems[i].getAllElements(true));
        }
        for (i in this.relationshipPanelItems) {
            r = r.concat(this.relationshipPanelItems[i].getAllElements(true));
        }
        for (i in this.basicPropertyPanelItems) {
            r = r.concat(this.basicPropertyPanelItems[i].getAllElements(true));
        }
        for (i in this.enumPanelItems) {
            r = r.concat(this.enumPanelItems[i].getAllElements(true));
        }
        for (i in this.actions) {
            r = r.concat(this.actions[i].getAllElements(true));
        }
        return r;
    }

    toJSON() {
        let i;

        // Get JSON for aggregated entities:
        var jsonSeperatorPanelItems = [];
        for (i in this.separatorPanelItems) {
            jsonSeperatorPanelItems.push(this.separatorPanelItems[i].toJSON());
        }
        // Get JSON for aggregated entities:
        var jsonRelationshipPanelItems = [];
        for (i in this.relationshipPanelItems) {
            jsonRelationshipPanelItems.push(this.relationshipPanelItems[i].toJSON());
        }
        // Get JSON for aggregated entities:
        var jsonBasicPropertyPanelItems = [];
        for (i in this.basicPropertyPanelItems) {
            jsonBasicPropertyPanelItems.push(this.basicPropertyPanelItems[i].toJSON());
        }
        // Get JSON for aggregated entities:
        var jsonEnumPanelItems = [];
        for (i in this.enumPanelItems) {
            jsonEnumPanelItems.push(this.enumPanelItems[i].toJSON());
        }
        // Get JSON for aggregated entities:
        var jsonActions = [];
        for (i in this.actions) {
            jsonActions.push(this.actions[i].toJSON());
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            columns: this.columns,
            alternatingColors: this.alternatingColors,
            separatorPanelItems: jsonSeperatorPanelItems,
            relationshipPanelItems: jsonRelationshipPanelItems,
            basicPropertyPanelItems: jsonBasicPropertyPanelItems,
            enumPanelItems: jsonEnumPanelItems,
            actions: jsonActions
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
        this.columns = json.columns;
        this.alternatingColors = json.alternatingColors;

        let jsElem;
        let newElem;

        for (let i in json.separatorPanelItems) {
            jsElem = json.separatorPanelItems[i];
            newElem = this.addNew_SeparatorPanelItem(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        for (let i in json.relationshipPanelItems) {
            jsElem = json.relationshipPanelItems[i];
            newElem = this.addNew_RelationshipPanelItem(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        for (let i in json.basicPropertyPanelItems) {
            jsElem = json.basicPropertyPanelItems[i];
            newElem = this.addNew_BasicPropertyPanelItem(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        for (let i in json.enumPanelItems) {
            jsElem = json.enumPanelItems[i];
            newElem = this.addNew_EnumPanelItem(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        for (let i in json.actions) {
            jsElem = json.actions[i];
            newElem = this.addNew_Action(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
    }
}

module.exports = Panel;
