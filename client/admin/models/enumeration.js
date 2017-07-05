const Literal = require('./literal');
const Property = require('./property');

class Enumeration extends Property {
    constructor(parent, id, name, desc) {
        super(parent, id, name, desc);

        // Enumerations:
        this.validEnumSelections = "";

        // Relationships:
        this.literals = [];
    }

    // Definitions for Enumerations
    // Enumeration.prototype.enumDef_validEnumSelections = ["One", "ZeroOne", "ZeroMany", "OneMany"];

    // Manage Aggregations:
    addNew_Literal(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var new_literals = new Literal(this, id, name, desc);
        new_literals.type = "Literal";
        this.literals.push(new_literals);
        return new_literals;
    }

    remove_Literal(id) {
        var idx = -1;
        this.literals.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.literals.splice(idx, 1);
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
        for (let i in this.literals) {
            r = r.concat(this.literals[i].getAllElements(true));
        }
        return r;
    }

    toJSON() {
    // Get JSON for aggregated entities:
        var jsonLiterals = [];
        for (let i in this.literals) {
            jsonLiterals.push(this.literals[i].toJSON());
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            validEnumSelections: this.validEnumSelections,
            literals: jsonLiterals
        };
    }

    fromJSON(json, parent) {
    // Base attibutes:
        this.parent = parent;
        this.name = json.name;
        this.desc = json.desc;
        this.type = json.type;
        this.id = json.id;
        // Enumerations:
        this.validEnumSelections = json.validEnumSelections;

        for (var i in json.literals) {
            var jsElem = json.literals[i];
            var newElem = this.addNew_Literal(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
    }
}

module.exports = Enumeration;
