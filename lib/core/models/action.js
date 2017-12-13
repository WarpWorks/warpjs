const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Base = require('./base');

class Action extends Base {
    constructor(parent, id, name, desc) {
        super("Action", parent, id, name, desc);
        this.pluginName = "Plugin Name";
    }

    toString() {
        return this.pluginName;
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            pluginName: this.pluginName
        };
    }

    static fromJSON(parent, jsonData) {
        const newAction = new Action(parent, jsonData.id, jsonData.name, jsonData.desc);
        newAction.pluginName = jsonData.pluginName;
        return newAction;
    }

    toFormResource(persistence, instance, docLevel) {
        return Promise.resolve(warpjsUtils.createResource('', {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            pluginName: this.pluginName,
            docLevel: docLevel.join('.')
        }));
    }
}


module.exports = Action;
