const _ = require('lodash');
const Promise = require('bluebird');

const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
const TableItem = require('./table-item');
const utils = require('./../utils');
const View = require('./view');

const COLLECTION_NAME = 'TableView';
const TYPE = 'TableView';

class TableView extends View {
    constructor(parent, id, name, desc) {
        super(TYPE, parent, id, name, desc);
        this.label = name;
        this.tableItems = [];
    }

    addNewTableItem(name, desc, property) {
        var id = this.getDomain().createNewID();
        var newTableItem = new TableItem(this, id, name, desc, property);
        this.tableItems.push(newTableItem);
        return newTableItem;
    }

    setAsDefault() {
        for (var i in this.parent.tableViews) {
            this.parent.tableViews[i].isDefault = false;
        }
        this.isDefault = true;
    }

    getAllElements(includeSelf) {
        var r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        for (var i in this.tableItems) {
            r = r.concat(this.tableItems[i]);
        }
        return r;
    }

    toString() {
        var s = this.name + " [";
        for (var i in this.tableItems) {
            s += this.tableItems[i].toString();
        }
        return s + "]; ";
    }

    toJSON() {
        return {
            name: this.name,
            desc: this.desc,
            type: this.type,
            id: this.idToJSON(),
            label: this.label,
            isDefault: this.isDefault,
            tableItems: utils.mapJSON(this.tableItems)
        };
    }

    processLocalTemplateFunctions(template) {
        var children = [["TableItem", this.tableItems]];

        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    save(persistence, entityPersistenceId) {
        return Promise.resolve()
            .then(() => this.toPersistenceJSON())
            .then((tableViewJson) => _.extend(tableViewJson, {
                parentID: entityPersistenceId,
                lastUpdated: (new Date()).toISOString()
            }))
            .then((tableViewJson) => {
                if (tableViewJson.id) {
                    // Need to update in db
                    throw new Error("TODO: Update table-view");
                }
                return Promise.resolve()
                    .then(() => persistence.save(COLLECTION_NAME, tableViewJson))
                    .then((saveResult) => saveResult.id)
                ;
            })
        ;
    }

    toPersistenceJSON() {
        return {
            type: this.type,
            name: this.name,
            description: this.desc,
            label: this.label,
            isDefault: this.isDefault,

            embedded: [{
                parentRelnID: 58,
                parentRelnName: 'tableItems',
                entities: this.tableItems.map((tableItem) => tableItem.toPersistenceJSON())
            }],

            parentRelnID: 20,
            parentRelnName: 'tableViews',
            parentBaseClassID: 9,
            parentBaseClassName: 'Entity'
        };
    }

    static fromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new TableView(parent, json.warpjsId, json.name, json.description))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.label = json.label;
                    instance.isDefault = json.isDefault;
                })
                .then(() => fromPersistenceEmbeddedJson(persistence, instance, json.embedded, 58, TableItem, 'tableItems'))
                .then(() => instance)
            )
        ;
    }

    static getPersistenceDocuments(persistence, parentID) {
        return Promise.resolve()
            .then(() => persistence.documents(COLLECTION_NAME, { parentID }, true))
        ;
    }
}

module.exports = TableView;
