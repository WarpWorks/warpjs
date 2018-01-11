const ComplexTypes = require('./../complex-types');
const createNewDomain = require('./create-new-domain');
const isValidModelId = require('./../is-valid-model-id');
const models = require('./../models');
const WarpWorksError = require('./../error');

function createInstanceFromJSON(jsonData, type, parent) {
    var i;
    var newRelationshipPanelItem;
    var t = jsonData.type;
    var id = jsonData.id;
    var name = jsonData.name;
    var desc = jsonData.desc;

    // Some basic validations
    if (t !== type) {
        throw new WarpWorksError("Element is of type '" + t + "'. Expected was '" + type + "'! ");
    }
    if (!isValidModelId(id)) {
        throw new WarpWorksError("Invalid ID!");
    }
    if (!name) {
        throw new WarpWorksError("No name specified for element of type: " + t);
    }

    switch (type) {
        case ComplexTypes.Domain:
            var newDomain = createNewDomain(name, desc, true); // Recreate = true!
            newDomain.entities = [];
            newDomain.definitionOfMany = jsonData.definitionOfMany;
            newDomain.lastUpdated = jsonData.lastUpdated;
            for (i in jsonData.entities) {
                newDomain.entities.push(createInstanceFromJSON(jsonData.entities[i], ComplexTypes.Entity, newDomain));
            }
            return newDomain;
        case ComplexTypes.Entity:
            var newEntity = new models.Entity(parent, id, name, desc);
            newEntity.isAbstract = jsonData.isAbstract;
            newEntity.entityType = jsonData.entityType;
            newEntity.namePlural = jsonData.namePlural;
            newEntity.isRootEntity = jsonData.isRootEntity;
            newEntity.isRootInstance = jsonData.isRootInstance;
            newEntity.parentClass = jsonData.parentClass; // Convert OID to reference later!
            newEntity.basicProperties = [];
            for (i in jsonData.basicProperties) {
                newEntity.basicProperties.push(createInstanceFromJSON(jsonData.basicProperties[i], ComplexTypes.BasicProperty, newEntity));
            }
            newEntity.enums = [];
            for (i in jsonData.enums) {
                newEntity.enums.push(createInstanceFromJSON(jsonData.enums[i], ComplexTypes.Enumeration, newEntity));
            }
            newEntity.relationships = [];
            for (i in jsonData.relationships) {
                newEntity.relationships.push(createInstanceFromJSON(jsonData.relationships[i], ComplexTypes.Relationship, newEntity));
            }
            newEntity.pageViews = [];
            for (i in jsonData.pageViews) {
                newEntity.pageViews.push(createInstanceFromJSON(jsonData.pageViews[i], ComplexTypes.PageView, newEntity));
            }
            newEntity.tableViews = [];
            for (i in jsonData.tableViews) {
                newEntity.tableViews.push(createInstanceFromJSON(jsonData.tableViews[i], ComplexTypes.TableView, newEntity));
            }
            return newEntity;
        case ComplexTypes.BasicProperty:
            var newProperty = new models.BasicProperty(parent, id, name, desc, jsonData.propertyType);
            newProperty.defaultValue = jsonData.defaultValue;
            newProperty.constraints = jsonData.constraints;
            newProperty.examples = jsonData.examples;
            return newProperty;
        case ComplexTypes.Enumeration:
            var newEnumeration = new models.Enumeration(parent, id, name, desc);
            for (i in jsonData.literals) {
                newEnumeration.literals.push(createInstanceFromJSON(jsonData.literals[i], ComplexTypes.Literal, newEnumeration));
            }
            return newEnumeration;
        case ComplexTypes.Literal:
            var newLiteral = new models.Literal(parent, id, name, desc);
            return newLiteral;
        case ComplexTypes.Relationship:
            var newRelationship = new models.Relationship(parent, jsonData.targetEntity, id, jsonData.isAggregation, name, desc);
            newRelationship.sourceRole = jsonData.sourceRole;
            newRelationship.sourceMax = jsonData.sourceMax;
            newRelationship.sourceMin = jsonData.sourceMin;
            newRelationship.sourceAverage = jsonData.sourceAverage;
            newRelationship.targetRole = jsonData.targetRole;
            newRelationship.targetMin = jsonData.targetMin;
            newRelationship.targetMax = jsonData.targetMax;
            newRelationship.targetAverage = jsonData.targetAverage;
            return newRelationship;
        case ComplexTypes.PageView:
            var newPageView = new models.views.PageView(parent, id, name, desc);
            newPageView.isDefault = jsonData.isDefault;
            newPageView.label = jsonData.label;
            for (i in jsonData.panels) {
                newPageView.panels.push(createInstanceFromJSON(jsonData.panels[i], ComplexTypes.Panel, newPageView));
            }
            return newPageView;
        case ComplexTypes.Panel:
            var newPanel = new models.views.Panel(parent, id, name, desc);
            newPanel.label = jsonData.label;
            newPanel.position = jsonData.position;
            newPanel.columns = jsonData.columns;
            newPanel.alternatingColors = jsonData.alternatingColors;
            for (i in jsonData.separatorPanelItems) {
                newPanel.separatorPanelItems.push(createInstanceFromJSON(jsonData.separatorPanelItems[i], ComplexTypes.SeparatorPanelItem, newPanel));
            }
            for (i in jsonData.relationshipPanelItems) {
                newPanel.relationshipPanelItems.push(
                    createInstanceFromJSON(jsonData.relationshipPanelItems[i], ComplexTypes.RelationshipPanelItem, newPanel)
                );
            }
            for (i in jsonData.basicPropertyPanelItems) {
                newPanel.basicPropertyPanelItems.push(createInstanceFromJSON(jsonData.basicPropertyPanelItems[i], ComplexTypes.BasicPropertyPanelItem, newPanel));
            }
            for (i in jsonData.enumPanelItems) {
                newPanel.enumPanelItems.push(createInstanceFromJSON(jsonData.enumPanelItems[i], ComplexTypes.EnumPanelItem, newPanel));
            }
            for (i in jsonData.actions) {
                newPanel.actions.push(createInstanceFromJSON(jsonData.actions[i], ComplexTypes.Action, newPanel));
            }
            return newPanel;
        case ComplexTypes.SeparatorPanelItem:
            var newSeparatorPanelItem = new models.views.SeparatorPanelItem(parent, id, name, desc);
            newSeparatorPanelItem.position = jsonData.position;
            newSeparatorPanelItem.label = jsonData.label;
            return newSeparatorPanelItem;
        case ComplexTypes.RelationshipPanelItem:
            newRelationshipPanelItem = new models.views.RelationshipPanelItem(parent, id, name, desc);
            newRelationshipPanelItem.position = jsonData.position;
            newRelationshipPanelItem.label = jsonData.label;
            newRelationshipPanelItem.relationship = jsonData.relationship;
            newRelationshipPanelItem.style = jsonData.style;
            return newRelationshipPanelItem;
        case ComplexTypes.BasicPropertyPanelItem:
            var newBasicPropertyPanelItem = new models.views.BasicPropertyPanelItem(parent, id, name, desc);
            newBasicPropertyPanelItem.basicProperty = jsonData.basicProperty;
            newBasicPropertyPanelItem.position = jsonData.position;
            newBasicPropertyPanelItem.label = jsonData.label;
            return newBasicPropertyPanelItem;
        case ComplexTypes.EnumPanelItem:
            var newEnumPanelItem = new models.views.EnumPanelItem(parent, id, name, desc);
            newEnumPanelItem.position = jsonData.position;
            newEnumPanelItem.label = jsonData.label;
            newEnumPanelItem.enumeration = jsonData.enumeration;
            return newEnumPanelItem;
        case ComplexTypes.Action:
            return models.views.Action.fromJSON(parent, jsonData);
        case ComplexTypes.TableView:
            var newTableView = new models.views.TableView(parent, id, name, desc);
            newTableView.isDefault = jsonData.isDefault;
            newTableView.label = jsonData.label;
            for (i in jsonData.tableItems) {
                newTableView.tableItems.push(createInstanceFromJSON(jsonData.tableItems[i], ComplexTypes.TableItem, newTableView));
            }
            return newTableView;
        case ComplexTypes.TableItem:
            return models.views.TableItem.fromJSON(parent, jsonData);
        default:
            throw new WarpWorksError("Invalid type: " + type);
    }
}

module.exports = createInstanceFromJSON;
