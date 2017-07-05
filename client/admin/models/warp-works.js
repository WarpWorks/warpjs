const Base = require('./base');
const Domain = require('./domain');

const SINGLETON = {};

class WarpWorks extends Base {
    constructor(parent, id, name, desc) {
        super("WarpWorks", parent, id, name, desc);

        // Relationships:
        this.Domains = [];
    }

    // Manage Aggregations:
    addNew_Domain(name, desc, existingID) {
        var id = existingID || 1;// 1 == ID for new Domains
        var newDomains = new Domain(this, id, name, desc);
        newDomains.type = "Domain";
        this.Domains.push(newDomains);
        return newDomains;
    }

    remove_Domain(id) {
        var idx = -1;
        this.Domains.forEach(function(elem, i) {
            if (elem.compareToMyID(id)) {
                idx = i;
            }
        });
        if (idx !== -1) {
            this.Domains.splice(idx, 1);
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
        for (let i in this.Domains) {
            r = r.concat(this.Domains[i].getAllElements(true));
        }
        return r;
    }

    toJSON() {
        // Get JSON for aggregated entities:
        var jsonDomains = [];
        for (let i in this.Domains) {
            jsonDomains.push(this.Domains[i].toJSON());
        }

        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            Domains: jsonDomains
        };
    }

    fromJSON(json, parent) {
    // Base attibutes:
        this.parent = parent;
        this.name = json.name;
        this.desc = json.desc;
        this.type = json.type;
        this.id = json.id;

        for (var i in json.Domains) {
            var jsElem = json.Domains[i];
            var newElem = this.addNew_Domain(jsElem.name, jsElem.desc, jsElem.id);
            newElem.fromJSON(jsElem, this);
        }
    }
}

WarpWorks.get = () => {
    if (!SINGLETON.WarpWorks) {
        SINGLETON.WarpWorks = new WarpWorks(null, null, 'Root', null);
    }
    return SINGLETON.WarpWorks;
};

module.exports = WarpWorks;
