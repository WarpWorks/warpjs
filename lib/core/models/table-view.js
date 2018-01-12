const _ = require('lodash');
const Promise = require('bluebird');

const ComplexTypes = require('./../complex-types');
const fromPersistenceEmbeddedJson = require('./from-persistence-embedded-json');
const TableItem = require('./table-item');
const utils = require('./../utils');
const View = require('./view');

const COLLECTION_NAME = 'TableView';
const TYPE = ComplexTypes.TableView;

class TableView extends View {
    constructor(parent, id, name, desc) {
        super(TYPE, parent, id, name, desc);
        this.label = name;
        this.tableItems = [];

        this.persistenceId = null;
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

    static fromFileJSON(jsonData, parent) {
        super.fromFileJSON(jsonData, parent, TYPE);

        const instance = new TableView(parent, jsonData.id, jsonData.name, jsonData.desc);
        instance.isDefault = jsonData.isDefault;
        instance.label = jsonData.label;

        instance.tableItems = jsonData.tableItems.map(
            (json) => TableItem.fromFileJSON(json, instance)
        );

        return instance;
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
        return _.extend({}, super.toPersistenceJSON(), {
            label: this.label,
            isDefault: this.isDefault,

            id: this.persistenceId,

            embedded: [{
                parentRelnID: 58,
                parentRelnName: 'tableItems',
                entities: this.tableItems.map((tableItem) => tableItem.toPersistenceJSON())
            }],

            parentRelnID: 20,
            parentRelnName: 'tableViews',
            parentBaseClassID: 9,
            parentBaseClassName: 'Entity'
        });
    }

    static fromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new TableView(parent, json.warpjsId, json.name, json.description))
            .then((instance) => Promise.resolve()
                .then(() => {
                    instance.label = json.label;
                    instance.isDefault = json.isDefault;
                    instance.persistenceId = json.id;
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
