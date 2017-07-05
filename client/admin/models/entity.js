const Base = require('./base');
const BasicProperty = require('./basic-property');
const Enumeration = require('./enumeration');
const PageView = require('./page-view');
const Relationship = require('./relationship');
const TableView = require('./table-view');

class Entity extends Base {
    constructor(parent, id, name, desc) {
        super("Entity", parent, id, name, desc);

        // Properties:
        this.isAbstract = true;
        this.namePlural = 'text';
        this.isRootEntity = true;
        this.isRootInstance = true;

        // Enumerations:
        this.entityType = "";

        // Relationships:
        this.basicProperties = [];
        this.relationships = [];
        this.pageViews = [];
        this.tableViews = [];
        this.enums = [];
        this.parentClass = [];
    }

    // Definitions for Enumerations
    // Entity.prototype.enumDef_entityType = ["Document", "Embedded"];

    // Manage Aggregations:
    addNew_BasicProperty(name, desc, existingID) {
        let id = existingID || this.getDomain().createNewID();
        let new_basicProperties = new BasicProperty(this, id, name, desc);
        new_basicProperties.type = "BasicProperty";
        this.basicProperties.push(new_basicProperties);
        return new_basicProperties;
    }

    remove_BasicProperty(id) {
        let idx = -1;
        this.basicProperties.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.basicProperties.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    addNew_Relationship(name, desc, existingID) {
        let id = existingID || this.getDomain().createNewID();
        let new_relationships = new Relationship(this, id, name, desc);
        new_relationships.type = "Relationship";
        this.relationships.push(new_relationships);
        return new_relationships;
    }

    remove_Relationship(id) {
        let idx = -1;
        this.relationships.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.relationships.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    addNew_PageView(name, desc, existingID) {
        let id = existingID || this.getDomain().createNewID();
        let new_pageViews = new PageView(this, id, name, desc);
        new_pageViews.type = "PageView";
        this.pageViews.push(new_pageViews);
        return new_pageViews;
    }

    remove_PageView(id) {
        let idx = -1;
        this.pageViews.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.pageViews.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    addNew_TableView(name, desc, existingID) {
        let id = existingID || this.getDomain().createNewID();
        let new_tableViews = new TableView(this, id, name, desc);
        new_tableViews.type = "TableView";
        this.tableViews.push(new_tableViews);
        return new_tableViews;
    }

    remove_TableView(id) {
        let idx = -1;
        this.tableViews.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.tableViews.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    addNew_Enumeration(name, desc, existingID) {
        let id = existingID || this.getDomain().createNewID();
        let new_enums = new Enumeration(this, id, name, desc);
        new_enums.type = "Enumeration";
        this.enums.push(new_enums);
        return new_enums;
    }

    remove_Enumeration(id) {
        let idx = -1;
        this.enums.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.enums.splice(idx, 1);
        } else {
            throw new Error("Element not found: " + id);
        }
    }

    // Misc utility functions
    getAllElements(includeSelf) {
        let r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        for (let i in this.basicProperties) {
            r = r.concat(this.basicProperties[i].getAllElements(true));
        }
        for (let i in this.relationships) {
            r = r.concat(this.relationships[i].getAllElements(true));
        }
        for (let i in this.pageViews) {
            r = r.concat(this.pageViews[i].getAllElements(true));
        }
        for (let i in this.tableViews) {
            r = r.concat(this.tableViews[i].getAllElements(true));
        }
        for (let i in this.enums) {
            r = r.concat(this.enums[i].getAllElements(true));
        }
        return r;
    }

    toJSON() {
        // Get JSON for aggregated entities:
        let jsonBasicProperties = [];
        for (let i in this.basicProperties) {
            jsonBasicProperties.push(this.basicProperties[i].toJSON());
        }
        // Get JSON for aggregated entities:
        let jsonRelationships = [];
        for (let i in this.relationships) {
            jsonRelationships.push(this.relationships[i].toJSON());
        }
        // Get JSON for aggregated entities:
        let jsonPageViews = [];
        for (let i in this.pageViews) {
            jsonPageViews.push(this.pageViews[i].toJSON());
        }
        // Get JSON for aggregated entities:
        let jsonTableViews = [];
        for (let i in this.tableViews) {
            jsonTableViews.push(this.tableViews[i].toJSON());
        }
        // Get JSON for aggregated entities:
        let jsonEnums = [];
        for (let i in this.enums) {
            jsonEnums.push(this.enums[i].toJSON());
        }
        // Get JSON for associations:
        let jsonParentClass = [];
        for (let i in this.parentClass) {
            jsonParentClass.push(this.parentClass[i].id);
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            isAbstract: this.isAbstract,
            namePlural: this.namePlural,
            isRootEntity: this.isRootEntity,
            isRootInstance: this.isRootInstance,
            entityType: this.entityType,
            basicProperties: jsonBasicProperties,
            relationships: jsonRelationships,
            pageViews: jsonPageViews,
            tableViews: jsonTableViews,
            enums: jsonEnums,
            parentClass: jsonParentClass
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
        this.isAbstract = json.isAbstract;
        this.namePlural = json.namePlural;
        this.isRootEntity = json.isRootEntity;
        this.isRootInstance = json.isRootInstance;
        // Enumerations:
        this.entityType = json.entityType;

        for (let i in json.basicProperties) {
            let jsElem = json.basicProperties[i];
            let newElem = this.addNew_BasicProperty(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        for (let i in json.relationships) {
            let jsElem = json.relationships[i];
            let newElem = this.addNew_Relationship(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        for (let i in json.pageViews) {
            let jsElem = json.pageViews[i];
            let newElem = this.addNew_PageView(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        for (let i in json.tableViews) {
            let jsElem = json.tableViews[i];
            let newElem = this.addNew_TableView(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        for (let i in json.enums) {
            let jsElem = json.enums[i];
            let newElem = this.addNew_Enumeration(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
        this.parentClass = json.parentClass; // Currently only works for *unary* associations!
    }
}

module.exports = Entity;
