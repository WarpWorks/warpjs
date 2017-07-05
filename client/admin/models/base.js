class Base {
    constructor(type, parent, id, name, desc) {
        if (/\W/i.test(name) || name.length < 2) {
            throw new Error("Invalid name: '" + name + "'. Please use only a-z, A-Z, 0-9 or _!");
        }
        this.type = type;
        this.parent = parent;
        this.id = id;
        this.name = name.replace(/ /g, ''); // Remove whitespaces
        this.desc = desc;
    }

    getDomain() {
        var domain = this;
        while (domain.type !== "Domain") {
            domain = domain.parent;
        }
        return domain;
    }

    compareToMyID(id) {
        return "" + this.id === "" + id;
    }

    idToJSON() {
        return this.id;
    }

    findElementByID(id) {
        var allElems = this.getAllElements(true);
        for (var i in allElems) {
            if (allElems[i].compareToMyID(id)) {
                var r = allElems[i];
                return r;
            }
        }
        return null;
    }
}

module.exports = Base;
