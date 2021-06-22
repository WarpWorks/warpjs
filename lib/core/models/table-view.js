const extend = require('lodash/extend');

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
        const id = this.getDomain().createNewID();
        const newTableItem = new TableItem(this, id, name, desc, property);
        this.tableItems.push(newTableItem);
        return newTableItem;
    }

    setAsDefault() {
        for (const i in this.parent.tableViews) {
            this.parent.tableViews[i].isDefault = false;
        }
        this.isDefault = true;
    }

    getAllElements(includeSelf) {
        let r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        for (const i in this.tableItems) {
            r = r.concat(this.tableItems[i]);
        }
        return r;
    }

    toString() {
        const tableItems = this.tableItems.map((tableItem) => tableItem.toString()).join('');
        return `${this.name} [${tableItems}]; `;
    }

    toJSON() {
        return extend({}, super.toJSON(), {
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
        const children = [[ "TableItem", this.tableItems ]];

        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    async save(persistence, parentID) {
        return super.save(persistence, parentID);
    }

    toPersistenceJSON() {
        const json = extend({}, super.toPersistenceJSON(), {
            parentRelnID: 20,
            parentRelnName: 'tableViews',
            parentBaseClassID: 9,
            parentBaseClassName: 'Entity'
        });

        json.embedded.push(this.mapChildrenPersistenceJSON(58, 'tableItems', this.tableItems));

        return json;
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);
        await this.fromPersistenceEmbeddedJson(persistence, json.embedded, 58, TableItem, 'tableItems');

        return this;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        const instance = new TableView(parent, json.warpjsId, json.name, json.desc);
        return instance.fromPersistenceJSON(persistence, json);
    }

    static async getPersistenceDocuments(persistence, parentID) {
        return persistence.documents(TYPE, { parentID }, true);
    }
}

module.exports = TableView;
