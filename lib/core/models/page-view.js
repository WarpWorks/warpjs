const _ = require('lodash');
// const debug = require('debug')('W2:models:page-view');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const ComplexTypes = require('./../complex-types');
const Panel = require('./panel');
const utils = require('./../utils');
const View = require('./view');

const TYPE = ComplexTypes.PageView;

class PageView extends View {
    constructor(parent, id, name, desc) {
        super(TYPE, parent, id, name, desc);
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
        return _.extend({}, super.toJSON(), {
            panels: utils.mapJSON(this.panels)
        });
    }

    fromJSON(json) {
        super.fromJSON(json);
        this.panels = this.fromJsonMapper(Panel, json.panels);
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new PageView(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    processLocalTemplateFunctions(template) {
        var children = [["Panel", this.panels]];

        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    toFormResourceBase() {
        return _.extend({}, super.toFormResourceBase(), {
        });
    }

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve()
            .then((panels) => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                docLevel: docLevel.join('.')
            })))
            .then((resource) => Promise.resolve()
                .then(() => this.getPanels())
                .then((panels) => Promise.map(panels, (panel) => panel.toFormResource(persistence, instance, docLevel, relativeToDocument)))
                .then((panels) => panels.sort(warpjsUtils.byPositionThenName))
                .then((panels) => {
                    resource.multiPanels = (panels.length > 1);
                    resource.panels = panels; // TODO: embed
                })
                .then(() => resource)
            )
        ;
    }

    toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', _.extend({}, this.toFormResourceBase(), {
                docLevel: docLevel.join('.')
            })))
            .then((resource) => Promise.resolve()
                .then(() => this.getPanels())
                .then((panels) => Promise.map(
                    panels,
                    (panel) => panel.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes)
                ))
                .then((panels) => panels.sort(warpjsUtils.byPositionThenName))
                .then((panels) => {
                    resource.multiPanels = (panels.length > 1);
                    resource.panels = panels; // TODO: embed
                })
                .then(() => resource)
            )
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
                    .then(() => persistence.save(TYPE, pageViewJson))
                    .then((saveResult) => saveResult.id)
                ;
            })
        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            parentRelnID: 19,
            parentRelnName: 'pageViews',
            parentBaseClassID: 9,
            parentBaseClassName: 'Entity'
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(64, 'panels', this.getPanels()));

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => {
                this.label = json.label;
            })
            .then(() => this.fromPersistenceEmbeddedJson(persistence, json.embedded, 64, Panel, 'panels'))
            .then(() => this.fromPersistenceEmbeddedJson(persistence, json.embedded, 65, Action, 'actions'))
            .then(() => this)
        ;
    }

    static getPersistenceDocuments(persistence, parentID) {
        // debug(`.getPersistenceDocuments(): parentID=${parentID}`);
        return Promise.resolve()
            .then(() => persistence.documents(TYPE, { parentID }, true))
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new PageView(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }
}
module.exports = PageView;
