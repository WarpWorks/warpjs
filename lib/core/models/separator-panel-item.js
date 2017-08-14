const warpjsUtils = require('@warp-works/warpjs-utils');

const PanelItem = require('./panel-item');

class SeparatorPanelItem extends PanelItem {
    constructor(parent, id, position) {
        var name = "Separator";
        var desc = "---------";
        super("SeparatorPanelItem", parent, id, name, desc, position);
        this.label = "";
    }

    toString() {
        return this.name + "; ";
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            position: this.position,
            label: this.label,
            id: this.idToJSON()
        };
    }

    toFormResource() {
        const resource = warpjsUtils.createResource('', {
            type: this.type,
            name: this.name,
            id: this.idToJSON(),
            desc: this.desc,
            label: this.label,
            position: this.position
        });

        return resource;
    }
}

module.exports = SeparatorPanelItem;
