const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const Action = require('./action');
const Base = require('./base');
const BasicPropertyPanelItem = require('./basic-property-panel-item');
const EnumPanelItem = require('./enum-panel-item');
const RelationshipPanelItem = require('./relationship-panel-item');
const SeparatorPanelItem = require('./separator-panel-item');
const utils = require('./../utils');

const TYPE = 'Panel';

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
        var s = this.name + " [";
        var panelItems = this.getAllPanelItems();
        for (var i in panelItems) {
            s += panelItems[i].toString();
        }
        return s + "]; ";
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            position: this.position,
            label: this.label,
            columns: this.columns,
            alternatingColors: this.alternatingColors,
            // Children:
            separatorPanelItems: utils.mapJSON(this.separatorPanelItems),
            relationshipPanelItems: utils.mapJSON(this.relationshipPanelItems),
            basicPropertyPanelItems: utils.mapJSON(this.basicPropertyPanelItems),
            enumPanelItems: utils.mapJSON(this.enumPanelItems),
            actions: utils.mapJSON(this.actions)
        };
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

    toFormResource(persistence, instance, docLevel, relativeToDocument) {
        return Promise.resolve()
            .then(() => warpjsUtils.createResource('', {
                name: this.name,
                desc: this.desc,
                type: this.type,
                id: this.idToJSON(),
                position: this.position,
                label: this.label,
                docLevel: docLevel.join('.')
            }))
            .then((resource) => Promise.resolve()
                // cannot use getAllPanelItems() because it contains actions,
                // which are not panel items.
                .then(() => []
                    .concat(this.separatorPanelItems)
                    .concat(this.relationshipPanelItems)
                    .concat(this.basicPropertyPanelItems)
                    .concat(this.enumPanelItems)
                )
                .then((panelItems) => Promise.map(panelItems, (relationshipPanelItem) => relationshipPanelItem.toFormResource(persistence, instance, docLevel, relativeToDocument)))
                .then((panelItems) => panelItems.sort(warpjsUtils.byPositionThenName))
                .then((items) => resource.embed('items', items))

                // panel actions
                .then(() => Promise.map(this.actions, (action) => action.toFormResource(persistence, instance, docLevel, relativeToDocument)))
                .then((actions) => resource.embed('actions', actions))

                .then(() => resource)
            )
        ;
    }

    toPersistenceJSON() {
        return {
            type: TYPE,
            name: this.name,
            description: this.desc,
            position: this.position,
            label: this.label,
            columns: this.columns,
            alternatingColors: this.alternatingColors,
            warpjsId: this.id,
            id: this.persistenceId,

            embedded: [{
                parentRelnID: 71,
                parentRelnName: 'separatorPanelItems',
                entities: this.separatorPanelItems.map((separatorPanelItem) => separatorPanelItem.toPersistenceJSON())
            }, {
                parentRelnID: 72,
                parentRelnName: 'relationshipPanelItems',
                entities: this.relationshipPanelItems.map((relationshipPanelItem) => relationshipPanelItem.toPersistenceJSON())
            }, {
                parentRelnID: 73,
                parentRelnName: 'basicPropertyPanelItems',
                entities: this.basicPropertyPanelItems.map((basicPropertyPanelItem) => basicPropertyPanelItem.toPersistenceJSON())
            }, {
                parentRelnID: 74,
                parentRelnName: 'enumPanelItems',
                entities: this.enumPanelItems.map((enumPanelItem) => enumPanelItem.toPersistenceJSON())
            }, {
                parentRelnID: 75,
                parentRelnName: 'actions',
                entities: this.actions.map((action) => action.toPersistenceJSON())
            }]
        };
    }
}

module.exports = Panel;
