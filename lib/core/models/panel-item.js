const Base = require('./base');

class PanelItem extends Base {
    constructor(type, parent, id, name, desc, position) {
        super(type, parent, id, name, desc);
        this.position = position || -1;
        this.label = name;
        this.readOnly = false;
    }

    // eslint-disable-next-line camelcase
    getParent_Panel() {
        return this.parent;
    }

    get isReadOnly() {
        return Boolean(this.readOnly);
    }
}

module.exports = PanelItem;
