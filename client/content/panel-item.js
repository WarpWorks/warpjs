const WarpWidget = require('./widget');

class WarpPanelItem extends WarpWidget {
    constructor(parent, type, config) {
        super(parent, config);
        this.type = type;
        this.position = config.position;
        this.label = config.label;
    }

    isFormItem() {
        return this.type === "Enum" ||
        this.type === "BasicProperty" ||
        (this.type === "Relationship" && this.style === "csv");
    }

    updateViewWithDataFromModel(callback) {
        if (this.type !== "Separator") {
            throw new Error("Internal error - function must be overridden");
        }
        callback();
    }

    updateModelWithDataFromView(callback) {
        if (this.type !== "Separator") {
            throw new Error("Internal error - function must be overridden");
        }
        callback();
    }

    createViews(parentHtml, callback) {
        callback();
    }
}

module.exports = WarpPanelItem;
