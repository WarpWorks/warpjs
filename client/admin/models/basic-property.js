const Property = require('./property');

class BasicProperty extends Property {
    constructor(parent, id, name, desc) {
        super(parent, id, name, desc);

        // Properties:
        this.defaultValue = 'text';
        this.constraints = 'text';
        this.examples = 'text';

        // Enumerations:
        this.propertyType = "";
    }

    // Definitions for Enumerations
    // BasicProperty.prototype.enumDef_propertyType = ["string", "text", "password", "number", "boolean", "date"];

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
            defaultValue: this.defaultValue,
            constraints: this.constraints,
            examples: this.examples,
            propertyType: this.propertyType
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
        this.defaultValue = json.defaultValue;
        this.constraints = json.constraints;
        this.examples = json.examples;
        // Enumerations:
        this.propertyType = json.propertyType;
    }
}

module.exports = BasicProperty;
