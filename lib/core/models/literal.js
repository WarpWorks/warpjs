const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');

const TYPE = 'Literal';

class Literal extends Base {
    constructor(enumeration, id, name, desc) {
        super(TYPE, enumeration, id, name, desc);
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

    toFormResource(persistence, instance, docLevel, selectedValue) {
        const resource = warpjsUtils.createResource('', {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            icon: this.icon,
            selected: (selectedValue === this.name) || undefined,
            docLevel: docLevel.join('.')
        });

        return resource;
    }

    newInstance() {
        return this.name;
    }

    toPersistenceJSON() {
        return {
            type: TYPE,
            name: this.name,
            description: this.desc,
            position: this.position,
            icon: this.icon,

            warjsId: this.id,
            id: this.persistenceId,

            embedded: []
        };
    }
}

module.exports = Literal;
