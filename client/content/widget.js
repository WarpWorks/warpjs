let widgetCounter = 0;

class WarpWidget {
    constructor(parent, config) {
        if (config === null || typeof config === "undefined") {
            throw new Error("Fatal: Can not add child to WarpWidget without 'config'!");
        }
        if (config.localID !== "WarpJS" && (parent === null || typeof parent === "undefined")) {
            throw new Error("Fatal: Can not add child to WarpWidget without 'parentEntityProxy'!");
        }
        if (config.localID === null || typeof config.localID === "undefined") {
            throw new Error(parent.globalID() + ": Can not add child with invalid localID!");
        }

        this._parent = parent;
        this._warpJSClient = null;

        this._wID = widgetCounter++;

        this._localID = config.localID;
        this._globalID = (this.hasParent() ? this.getParent().globalID() + "_" : "") + this._localID;
    }

    getWarpJSClient() {
        if (!this._warpJSClient) {
            var parent = this;
            while (parent.getParent()) {
                parent = parent.getParent();
            }
            this._warpJSClient = parent;
        }
        return this._warpJSClient;
    }

    updateViewWithDataFromModel() {
        throw new Error("updateViewWithDataFromModel():\n-  This function must be implemented by child classes");
    }

    updateModelWithDataFromView() {
        throw new Error("writeViewDataFromModel():\n-  This function must be implemented by child classes");
    }

    getPageView() {
        return this.getParent().getPageView();
    }

    getParent() {
        return this._parent;
    }

    hasParent() {
        return this._parent !== null && typeof this._parent !== "undefined";
    }

    localID() {
        return this._localID;
    }

    globalID() {
        return this._globalID;
    }
}

module.exports = WarpWidget;
