const _ = require('lodash');
const Promise = require('bluebird');

const ComplexTypes = require('./../complex-types');
const TableItem = require('./table-item');
const utils = require('./../utils');
const View = require('./view');

const TYPE = ComplexTypes.TableView;

class TableView extends View {
    constructor(parent, id, name, desc) {
        super(TYPE, parent, id, name, desc);
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
        return _.extend({}, super.toJSON(), {
            label: this.label,
            isDefault: this.isDefault,
            tableItems: utils.mapJSON(this.tableItems)
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.label = json.label;
        this.isDefault = json.isDefault;

        this.tableItems = this.fromJsonMapper(TableItem, json.tableItems);
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new TableView(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
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
                    .then(() => persistence.save(TYPE, tableViewJson))
                    .then((saveResult) => saveResult.id)
                ;
            })
        ;
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            parentRelnID: 20,
            parentRelnName: 'tableViews',
            parentBaseClassID: 9,
            parentBaseClassName: 'Entity'
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(58, 'tableItems', this.tableItems));

        return json;
    }

    fromPersistenceJSON(persistence, json) {
        return Promise.resolve()
            .then(() => super.fromPersistenceJSON(persistence, json))
            .then(() => this.fromPersistenceEmbeddedJson(persistence, json.embedded, 58, TableItem, 'tableItems'))
            .then(() => this)
        ;
    }

    static instantiateFromPersistenceJSON(persistence, json, parent) {
        return Promise.resolve()
            .then(() => new TableView(parent, json.warpjsId, json.name, json.desc))
            .then((instance) => instance.fromPersistenceJSON(persistence, json))
            .then((instance) => instance)
        ;
    }

    static getPersistenceDocuments(persistence, parentID) {
        return Promise.resolve()
            .then(() => persistence.documents(TYPE, { parentID }, true))
        ;
    }
}

module.exports = TableView;
