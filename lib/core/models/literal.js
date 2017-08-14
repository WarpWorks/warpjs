const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');

class Literal extends Base {
    constructor(enumeration, id, name, desc) {
        super("Literal", enumeration, id, name, desc);
        this.position = null;
        this.icon = null;
    }

    // eslint-disable-next-line camelcase
    getParent_Enumeration() {
        return this.parent;
    }

    toString() {
        return this.name;
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON()
        };
    }

    toFormResource(selectedValue) {
        const resource = warpjsUtils.createResource('', {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            icon: this.icon,
            selected: (selectedValue === this.name) || undefined
        });

        return resource;
    }
}

module.exports = Literal;
