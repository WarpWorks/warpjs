const clone = require('lodash/clone');
const extend = require('lodash/extend');
const Promise = require('bluebird');
const reduce = require('lodash/reduce');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const ComplexTypes = require('./../complex-types');
// const debug = require('./debug')('panel');
const Panel = require('./panel');
const shorten = require('./../../utils/shorten');
const utils = require('./../utils');
const View = require('./view');

const TYPE = ComplexTypes.PageView;

class PageView extends View {
    constructor(parent, id, name, desc) {
        super(TYPE, parent, id, name, desc);
        this.panels = [];
        this.isDefault = false;
        this.style = null;
    }

    addNewPanel(name, desc) {
        const id = this.getDomain().createNewID();
        const newPanel = new Panel(this, id, name, desc);
        this.panels.push(newPanel);
        return newPanel;
    }

    getPanels(sorted) {
        const cloned = clone(this.panels);
        return Object.freeze(sorted ? cloned.sort(warpjsUtils.byPositionThenName) : cloned);
    }

    setAsDefault() {
        for (const i in this.parent.pageViews) {
            this.parent.pageViews[i].isDefault = false;
        }
        this.isDefault = true;
    }

    getAllElements(includeSelf) {
        let r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        for (const i in this.panels) {
            r = r.concat(this.panels[i].getAllElements(true));
        }
        return r;
    }

    toString() {
        const panels = this.panels.map((panel) => panel.toString()).join('');
        return `${this.name} [${panels}]; `;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            style: this.style,
            panels: utils.mapJSON(this.panels)
        });
    }

    fromJSON(json) {
        super.fromJSON(json);
        this.panels = this.fromJsonMapper(Panel, json.panels);
        this.style = json.style;
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new PageView(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    processLocalTemplateFunctions(template) {
        const children = [[ "Panel", this.panels ]];

        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
            style: this.style
        });
    }

    async toFormResource(persistence, instance, docLevel, relativeToDocument) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            carouselLabel: shorten(this.getDisplayName(instance)),
            docLevel: docLevel.join('.'),
            isOfStyle: reduce(
                // FIXME: hard-coded. Should come from the level0 document.
                [
                    'Plain',
                    'BoK',
                    'Insight',
                    'Testbed'
                ],
                (memo, style) => extend(memo, { [style]: style === this.style }),
                {}
            )
        }));

        let panels = this.getPanels();
        panels = await Promise.map(
            panels,
            async (panel) => panel.toFormResource(persistence, instance, docLevel, relativeToDocument)
        );
        panels.sort(warpjsUtils.byPositionThenName);

        resource.multiPanels = (panels.length > 1);
        resource.embed('panels', panels);

        return resource;
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            carouselLabel: shorten(this.getDisplayName(instance)),
            docLevel: docLevel.toString()
        }));

        const panels = await Promise.map(
            this.getPanels(),
            async (panel) => panel.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes)
        );

        panels.sort(warpjsUtils.byPositionThenName);

        resource.multiPanels = (panels.length > 1);
        resource.embed('panels', panels);

        return resource;
    }

    async save(persistence, parentID) {
        return super.save(persistence, parentID);
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            parentRelnID: 19,
            parentRelnName: 'pageViews',
            parentBaseClassID: 9,
            parentBaseClassName: 'Entity'
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(64, 'panels', this.getPanels()));

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

        this.label = json.label;
        this.style = json.style;

        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 64, Panel, 'panels');
        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 65, Action, 'actions');

        return this;
    }

    static async getPersistenceDocuments(persistence, parentID) {
        // debug(`.getPersistenceDocuments(): parentID=${parentID}`);
        return persistence.documents(TYPE, { parentID }, true);
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new PageView(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }
}
module.exports = PageView;
