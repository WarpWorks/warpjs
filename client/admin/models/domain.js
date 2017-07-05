const Base = require('./base');
const Entity = require('./entity');

class Domain extends Base {
    constructor(parent, id, name, desc) {
        super("Domain", parent, id, name, desc);

        // Properties:
        this.definitionOfMany = 0;
        this.id_counter = 1;

        // Relationships:
        this.entities = [];
    }

    // Manage Aggregations:
    addNew_Entity(name, desc, existingID) {
        var id = existingID || this.getDomain().createNewID();
        var new_entities = new Entity(this, id, name, desc);
        new_entities.type = "Entity";
        this.entities.push(new_entities);
        return new_entities;
    }

    remove_Entity(id) {
        var idx = -1;
        this.entities.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.entities.splice(idx, 1);
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
        for (let i in this.entities) {
            r = r.concat(this.entities[i].getAllElements(true));
        }
        return r;
    }

    toJSON() {
        // Get JSON for aggregated entities:
        var jsonEntities = [];
        for (let i in this.entities) {
            jsonEntities.push(this.entities[i].toJSON());
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            definitionOfMany: this.definitionOfMany,
            entities: jsonEntities
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
        this.definitionOfMany = json.definitionOfMany;

        for (var i in json.entities) {
            var jsElem = json.entities[i];
            var newElem = this.addNew_Entity(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
    }
}

Domain.fromJSON = (json) => {
    // To avoid cyclic require().
    const WarpWorks = require('./warp-works');

    var domain = WarpWorks.get().addNew_Domain(json.name, json.desc, json.id);
    domain.fromJSON(json, null);

    // In the JSON format, references have been replaces with OIDs.
    // Now we must replace any of these OIDs with real object references again
    // (same code as on server side...)
    var oid = -1;
    var target = null;
    for (let i in domain.entities) {
        var e = domain.entities[i];
        if (e.hasParentClass()) {
            oid = e.getParentClass();
            target = domain.findElementByID(oid);
            if (target) {
                e.setParentClass(target);
            }
            // Else: Assume that target is in different domain
            // TBD: Think of some kind of "lazy loading" for entities in different domains!
        }
        for (let i in e.relationships) {
            var r = e.relationships[i];
            oid = r.getTargetEntity();
            target = domain.findElementByID(oid);
            if (target) {
                r.setTargetEntity(target);
            }
        }
        for (let i in e.tableViews) {
            var tv = e.tableViews[i];
            for (let j in tv.tableItems) {
                var ti = tv.tableItems[j];
                oid = ti.property;
                target = domain.findElementByID(oid);
                if (target) {
                    ti.setProperty(target);
                }
            }
        }
        for (let i in e.pageViews) {
            var pv = e.pageViews[i];
            for (let j in pv.panels) {
                var p = pv.panels[j];
                for (let k in p.relationshipPanelItems) {
                    var rpi = p.relationshipPanelItems[k];
                    oid = rpi.relationship;
                    target = domain.findElementByID(oid);
                    if (target) {
                        rpi.setRelationship(target);
                    }
                }
                for (let l in p.basicPropertyPanelItems) {
                    var bppi = p.basicPropertyPanelItems[l];
                    oid = bppi.basicProperty;
                    target = domain.findElementByID(oid);
                    if (target) {
                        bppi.setBasicProperty(target);
                    }
                }
                for (let m in p.enumPanelItems) {
                    var epi = p.enumPanelItems[m];
                    oid = epi.enumeration;
                    target = domain.findElementByID(oid);
                    if (target) {
                        epi.setEnumeration(target);
                    }
                }
            }
        }
    }

    return domain;
};

module.exports = Domain;
