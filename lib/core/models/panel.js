const extend = require('lodash/extend');
const Promise = require('bluebird');
const uuid = require('uuid/v4');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const Base = require('./base');
const BasicPropertyPanelItem = require('./basic-property-panel-item');
const ComplexTypes = require('./../complex-types');
// const debug = require('./debug')('panel');
const EnumPanelItem = require('./enum-panel-item');
const RelationshipPanelItem = require('./relationship-panel-item');
const SeparatorPanelItem = require('./separator-panel-item');
const utils = require('./../utils');

const TYPE = ComplexTypes.Panel;

class Panel extends Base {
    constructor(parent, id, name, desc) {
        super(TYPE, parent, id, name, desc);
        this.position = null;
        this.columns = 1;
        this.alternatingColors = false;
        this.label = name;

        // Children:
        this.separatorPanelItems = [];
        this.relationshipPanelItems = [];
        this.basicPropertyPanelItems = [];
        this.enumPanelItems = [];
        this.actions = [];
    }

    // eslint-disable-next-line camelcase
    getParent_PageView() {
        return this.parent;
    }

    addNewSeparatorPanelItem() {
        var id = this.getDomain().createNewID();
        var newSeparatorPanelItem = new SeparatorPanelItem(this, id);
        this.separatorPanelItems.push(newSeparatorPanelItem);
        return newSeparatorPanelItem;
    }

    addNewRelationshipPanelItem(name, desc, relationship) {
        var id = this.getDomain().createNewID();
        var newRelationshipPanelItem = new RelationshipPanelItem(this, id, name, desc, relationship);
        this.relationshipPanelItems.push(newRelationshipPanelItem);
        return newRelationshipPanelItem;
    }

    addNewBasicPropertyPanelItem(name, desc, basicProperty) {
        var id = this.getDomain().createNewID();
        var newBasicPropertyPanelItem = new BasicPropertyPanelItem(this, id, name, desc, basicProperty);
        this.basicPropertyPanelItems.push(newBasicPropertyPanelItem);
        return newBasicPropertyPanelItem;
    }

    addNewEnumPanelItem(name, desc, enumeration) {
        var id = this.getDomain().createNewID();
        var newEnumPanelItem = new EnumPanelItem(this, id, name, desc, enumeration);
        this.enumPanelItems.push(newEnumPanelItem);
        return newEnumPanelItem;
    }

    getPanelItems() {
        return []
            .concat(this.separatorPanelItems)
            .concat(this.relationshipPanelItems)
            .concat(this.basicPropertyPanelItems)
            .concat(this.enumPanelItems)
            .sort(warpjsUtils.byPositionThenName)
        ;
    }

    getAllPanelItems() {
        return []
            .concat(this.separatorPanelItems)
            .concat(this.relationshipPanelItems)
            .concat(this.basicPropertyPanelItems)
            .concat(this.enumPanelItems)
            .concat(this.actions)
        ;
    }

    addNewAction(name, desc, enumeration, icon, functionName) {
        var id = this.getDomain().createNewID();
        var newAction = new Action(this, id, name, desc, enumeration);
        newAction.icon = icon;
        newAction.functionName = functionName;
        this.actions.push(newAction);
        return newAction;
    }

    getAllElements(includeSelf) {
        var r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        r = r.concat(this.getAllPanelItems());
        return r;
    }

    toString() {
        const panelItems = this.getAllPanelItems().map((panelItem) => panelItem.toString()).join('');
        return `${this.name} [${panelItems}]; `;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
            position: this.position,
            columns: this.columns,
            alternatingColors: this.alternatingColors,
            label: this.label,

            // Children:
            separatorPanelItems: utils.mapJSON(this.separatorPanelItems),
            relationshipPanelItems: utils.mapJSON(this.relationshipPanelItems),
            basicPropertyPanelItems: utils.mapJSON(this.basicPropertyPanelItems),
            enumPanelItems: utils.mapJSON(this.enumPanelItems),
            actions: utils.mapJSON(this.actions)
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.position = json.position;
        this.columns = json.columns;
        this.alternatingColors = json.alternatingColors;
        this.label = json.label;

        this.separatorPanelItems = this.fromJsonMapper(SeparatorPanelItem, json.separatorPanelItems);
        this.relationshipPanelItems = this.fromJsonMapper(RelationshipPanelItem, json.relationshipPanelItems);
        this.basicPropertyPanelItems = this.fromJsonMapper(BasicPropertyPanelItem, json.basicPropertyPanelItems);
        this.enumPanelItems = this.fromJsonMapper(EnumPanelItem, json.enumPanelItems);
        this.actions = this.fromJsonMapper(Action, json.actions);
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new Panel(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    processLocalTemplateFunctions(template) {
        var aggregationPanelItems = [];
        var associationPanelItems = [];
        for (var i in this.relationshipPanelItems) {
            var rpi = this.relationshipPanelItems[i];
            // var reln = rpi.getRelationship();
            if (rpi.getRelationship().isAggregation) {
                aggregationPanelItems.push(rpi);
            } else {
                associationPanelItems.push(rpi);
            }
        }

        var children = [
            ["SeparatorPanelItem", this.separatorPanelItems],
            ["RelationshipPanelItem", this.relationshipPanelItems],
            ["AggregationPanelItem", aggregationPanelItems],
            ["AssociationPanelItem", associationPanelItems],
            ["BasicPropertyPanelItem", this.basicPropertyPanelItems],
            ["EnumPanelItem", this.enumPanelItems],
            ["Action", this.actions]
        ];

        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    toFormResourceBase() {
        return extend({}, super.toFormResourceBase(), {
            position: this.position,
            columns: this.columns,
            alternatingColors: this.alternatingColors,
            label: this.label
        });
    }

    async toFormResource(persistence, instance, docLevel, relativeToDocument) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.join('.')
        }));

        // Panel items
        const panelItems = this.getPanelItems();
        const items = await Promise.map(
            panelItems,
            async (panelItem) => panelItem.toFormResource(persistence, instance, docLevel, relativeToDocument)
        );
        resource.embed('items', items.sort(warpjsUtils.byPositionThenName));

        // panel actions
        const actions = await Promise.map(
            this.actions,
            async (action) => action.toFormResource(persistence, instance, docLevel, relativeToDocument)
        );
        resource.embed('actions', actions);

        return resource;
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes) {
        const resource = warpjsUtils.createResource('', extend({}, this.toFormResourceBase(), {
            docLevel: docLevel.toString()
        }));

        // Panel items
        const panelItems = this.getPanelItems();
        const items = await Promise.map(
            panelItems,
            async (panelItem) => panelItem.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes)
        );

        resource.embed('items', items.sort(warpjsUtils.byPositionThenName));

        // panel actions
        const actions = await Promise.map(
            this.actions,
            async (action) => action.toStudioResource(persistence, instance, docLevel, relativeToDocument, routes)
        );
        resource.embed('actions', actions);

        return resource;
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            _id: this._id || uuid(),
            position: this.position,
            columns: this.columns,
            alternatingColors: this.alternatingColors,
            label: this.label,
            style: this.style
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(71, 'separatorPanelItems', this.separatorPanelItems));
        json.embedded.push(this.mapChildrenPersistenceJSON(72, 'relationshipPanelItems', this.relationshipPanelItems));
        json.embedded.push(this.mapChildrenPersistenceJSON(73, 'basicPropertyPanelItems', this.basicPropertyPanelItems));
        json.embedded.push(this.mapChildrenPersistenceJSON(74, 'enumPanelItems', this.enumPanelItems));
        json.embedded.push(this.mapChildrenPersistenceJSON(75, 'actions', this.actions));

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

        this._id = json._id;
        this.position = json.position;
        this.label = json.label;
        this.columns = json.columns;
        this.alternatingColors = json.alternatingColors;
        this.style = json.style;

        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 71, SeparatorPanelItem, 'separatorPanelItems');
        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 72, RelationshipPanelItem, 'relationshipPanelItems');
        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 73, BasicPropertyPanelItem, 'basicPropertyPanelItems');
        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 74, EnumPanelItem, 'enumPanelItems');
        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 75, Action, 'actions');

        return this;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new Panel(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }
}

module.exports = Panel;
