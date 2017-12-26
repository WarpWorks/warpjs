const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Panel = require('./panel');
const utils = require('./../utils');
const View = require('./view');

class PageView extends View {
    constructor(parent, id, name, desc) {
        super("PageView", parent, id, name, desc);
        this.label = name;
        this.panels = [];
    }

    addNewPanel(name, desc) {
        var id = this.getDomain().createNewID();
        var newPanel = new Panel(this, id, name, desc);
        this.panels.push(newPanel);
        return newPanel;
    }

    getPanels() {
        return this.panels;
    }

    setAsDefault() {
        for (var i in this.parent.pageViews) {
            this.parent.pageViews[i].isDefault = false;
        }
        this.isDefault = true;
    }

    getAllElements(includeSelf) {
        var r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        for (var i in this.panels) {
            r = r.concat(this.panels[i].getAllElements(true));
        }
        return r;
    }

    toString() {
        var s = this.name + " [";
        for (var i in this.panels) {
            s += this.panels[i].toString();
        }
        return s + "]; ";
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            isDefault: this.isDefault,
            id: this.idToJSON(),
            label: this.label,
            panels: utils.mapJSON(this.panels)
        };
    }

    processLocalTemplateFunctions(template) {
        var children = [["Panel", this.panels]];

        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve(this.getPanels())
            .then((panels) => Promise.map(panels, (panel) => panel.toFormResource(persistence, instance, docLevel, relativeToDocument)))
            .then((panels) => panels.sort(warpjsUtils.byPositionThenName))
            .then((panels) => warpjsUtils.createResource('', {
                name: this.name,
                desc: this.desc,
                type: this.type,
                id: this.idToJSON(),
                label: this.label,
                multiPanels: (panels.length > 1),
                docLevel: docLevel.join('.'),
                panels
            }))
        ;
    }
}
module.exports = PageView;
