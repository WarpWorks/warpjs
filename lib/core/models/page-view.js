const _ = require('lodash');
// const debug = require('debug')('W2:models:page-view');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const ComplexTypes = require('./../complex-types');
const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
const Panel = require('./panel');
const utils = require('./../utils');
const View = require('./view');

const COLLECTION_NAME = 'PageView';
const TYPE = ComplexTypes.PageView;

class PageView extends View {
    constructor(parent, id, name, desc) {
        super(TYPE, parent, id, name, desc);
        this.label = name;
        this.panels = [];
        this.actions = [];
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

    getActions() {
        return this.actions;
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

    static fromFileJSON(jsonData, parent) {
        super.fromFileJSON(jsonData, parent, TYPE);

        const newPageView = new PageView(parent, jsonData.id, jsonData.name, jsonData.desc);
        newPageView.isDefault = jsonData.isDefault;
        newPageView.label = jsonData.label;

        newPageView.panels = jsonData.panels.map(
            (panelJson) => Panel.fromFileJSON(panelJson, newPageView)
        );

        return newPageView;
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

    save(persistence, parentID) {
        return Promise.resolve()
            .then(() => this.toPersistenceJSON())
            .then((pageViewJson) => _.extend(pageViewJson, {
                parentID,
                lastUpdated: (new Date()).toISOString()
            }))
            .then((pageViewJson) => {
                if (pageViewJson.id) {
                    // Need to update in db
                    throw new Error("TODO: Update page view");
                }
                return Promise.resolve()
                    .then(() => persistence.save(COLLECTION_NAME, pageViewJson))
                    .then((saveResult) => saveResult.id)
                ;
            })
        ;
    }

    toPersistenceJSON() {
        return _.extend({}, super.toPersistenceJSON(), {
            label: this.label,
            isDefault: this.isDefault,
            parentRelnID: 19,
            parentRelnName: 'pageViews',
            parentBaseClassID: 9,
            parentBaseClassName: 'Entity',

            embedded: [{
                parentRelnID: 64,
                parentRelnName: 'panels',
                entities: this.getPanels().map((panel) => panel.toPersistenceJSON())
            }, {
                parentRelnID: 65,
                parentRelnName: 'actions',
                entities: this.getActions().map((action) => action.toPersistenceJSON())
            }]
        });
    }

    static getPersistenceDocuments(persistence, parentID) {
        // debug(`.getPersistenceDocuments(): parentID=${parentID}`);
        return Promise.resolve()
            .then(() => persistence.documents(COLLECTION_NAME, { parentID }, true))
        ;
    }

    static fromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new PageView(parent, json.warpjsId, json.name, json.description))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.isDefault = json.isDefault;
                    instance.label = json.label;
                })
                .then(() => fromPersistenceEmbeddedJson(persistence, instance, json.embedded, 64, Panel, 'panels'))
                .then(() => fromPersistenceEmbeddedJson(persistence, instance, json.embedded, 65, Action, 'actions'))
                .then(() => instance)
            )
        ;
    }
}
module.exports = PageView;
