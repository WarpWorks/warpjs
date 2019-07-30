const _ = require('lodash');
const Promise = require('bluebird');
const RoutesInfo = require('@quoin/expressjs-routes-info');
const uuid = require('uuid/v4');
const warpjsUtils = require('@warp-works/warpjs-utils');

const { DEFAULT_VERSION } = require('./../../constants');
const Base = require('./base');
const BasicProperty = require('./basic-property');
const ComplexTypes = require('./../complex-types');
const config = require('./../../../server/config');
const debug = require('./debug')('entity');
const DOCUMENT_STATUS = require('./../first-class/document-status');
const entityOverview = require('./entity-overview');
const EntityTypes = require('./../entity-types');
const Enumeration = require('./enumeration');
const Notification = require('./../first-class/notification');
const PageView = require('./page-view');
const Relationship = require('./relationship');
const RELATIONSHIP_PANEL_ITEM_STYLES = require('./../relationship-panel-item-styles');
const TableView = require('./table-view');
const updatePathInfo = require('./../update-path-info');
const utils = require('./../utils');
const WarpWorksError = require('./../error');
const views = require('./views');

const TYPE = ComplexTypes.Entity;

function ensureInstanceEmbedded(instance) {
    if (!instance.embedded) {
        instance.embedded = [];
    }
}

function nonDuplicate(parentItems, items) {
    return items.reduce(
        (cumulator, item) => cumulator.filter((cumulated) => cumulated.name !== item.name).concat(item),
        _.clone(parentItems)
    );
}

class Entity extends Base {
    constructor(domain, id, name, desc, parentClass, isRootEntity, isRootInstance) {
        super(TYPE, domain, id, name, desc);

        this.isRootEntity = isRootEntity;
        this.isRootInstance = isRootInstance;
        this.isAbstract = false;
        this.namePlural = name + "s"; // FIXME: Can use more logic here.
        this.entityType = EntityTypes.DOCUMENT;
        this.persistenceId = null;

        if (isRootEntity) {
            // Create relationship to rootInstance
            this.setRootEntityStatus(true);
        }

        // Inheritance
        this.setParentClass(parentClass);

        // Child elements:
        this.basicProperties = [];
        this.enums = [];
        this.relationships = [];
        this.pageViews = [];
        this.tableViews = [];
    }

    get entityDisplayName() {
        const prefix = (this.isAbstract) ? '%' : (this.isRootInstance) ? '#' : '';
        return `${prefix}${this.name}`;
    }

    // eslint-disable-next-line camelcase
    getParent_Domain() {
        return this.parent;
    }

    setRootEntityStatus(declareAsRootEntity) {
        if (this.isRootInstance) {
            throw new WarpWorksError("Can not convert RootInstance to RootEntity!");
        } else if (!declareAsRootEntity) {
            throw new WarpWorksError("Currently not supported, sorry - TBD!");
        } else {
            if (this.isRootEntity) {
                // Is already a root instance, ignore...
                return;
            }
            var relName = this.namePlural.charAt(0).toUpperCase() + this.namePlural.slice(1);
            var rel = this.getDomain().getRootInstance().addNewRelationship(this, true, relName);
            rel.targetMax = '*';
            this.isRootEntity = true;
        }
    }

    isDocument(instance) {
        if (instance) {
            return instance.entityType === EntityTypes.DOCUMENT;
        }
        return this.entityType === EntityTypes.DOCUMENT;
    };

    async getOverview(persistence, instance) {
        // eslint-disable-next-line no-console
        console.warn(`*** DEPRECATION *** Do not use getOverview(). Stack:`, new Error());
        const relationships = this.getRelationships();
        const overviewRelationships = relationships.filter((relationship) => relationship.name === 'Overview');

        if (overviewRelationships && overviewRelationships.length) {
            return entityOverview(
                persistence,
                instance,
                overviewRelationships[overviewRelationships.length - 1], // Use the last because of inheritence.
                3 // FIXME: This is hard-coded.
            );
        } else {
            return null;
        }
    }

    /**
     *  Gets the overviews.
     */
    async getOverviews(persistence, instance) {
        // eslint-disable-next-line no-console
        console.warn(`*** DEPRECATION *** Do not use getOverviews(). Stack:`, new Error());
        const relationship = this.getRelationshipByName('Overview');
        const overviews = relationship ? await relationship.getDocuments(persistence, instance) : [];

        return overviews.map((overview) => _.pick(overview, [ 'Heading', 'Content' ]));
    }

    /**
     *  Gets the first image of the first overview.
     */
    async getSnippetImageUrl(persistence, instance) {
        const relationship = this.getRelationshipByName('Overview');

        if (relationship) {
            const targetEntity = relationship.getTargetEntity();

            const overviews = await relationship.getDocuments(persistence, instance);
            const overview = overviews.shift();

            if (overview) {
                // Try get the image.
                const relationship = targetEntity.getRelationshipByName('Images');
                const images = relationship ? await relationship.getDocuments(persistence, overview) : [];
                const image = images.shift();
                return image ? image.ImageURL : null;
            }
        }
    }

    canBeInstantiated() {
        if (this.isRootEntity || this.isRootInstance) {
            return true;
        }
        var parentAggs = this.getAllParentAggregations();
        if (parentAggs && parentAggs.length) {
            return true;
        }
        if (this.hasParentClass()) {
            return this.getParentClass().canBeInstantiated();
        }
        return false;
    }

    newInstance(parentRelationship, warpjsId) {
        const instance = {
            type: this.name // FIXME: Use immutable value.
        };

        if (warpjsId) {
            instance.warpjsId = warpjsId;
        }

        if (!this.isDocument()) {
            instance._id = uuid();
        }

        this.getBasicProperties().forEach((prop) => {
            instance[prop.name] = prop.newInstance();
        });

        this.getEnums().forEach((prop) => {
            instance[prop.name] = prop.newInstance();
        });

        instance.embedded = [];

        return instance;
    }

    hasParentClass() {
        return Boolean(this.parentClass && this.parentClass.length && this.parentClass[0] != null);
    }

    getParentClass() {
        return this.parentClass[0];
    }

    getBaseClass() {
        // BaseClass = Topmost, non-abstract class in the inheritance hierarchy
        var res = this;
        while (res.hasParentClass() && !res.getParentClass().isAbstract) {
            res = res.getParentClass();
        }
        if (res.isAbstract) {
            return null;
        }
        return res;
    }

    setParentClass(pc) {
        if (pc !== null) {
            this.parentClass = [ pc ];
        }
    }

    getBasicProperties(ignoreInheritedProperties) {
        if (!ignoreInheritedProperties && this.hasParentClass()) {
            return nonDuplicate(this.getParentClass().getBasicProperties(), this.basicProperties);
        } else {
            return _.clone(this.basicProperties);
        }
    }

    getBasicPropertyByName(name) {
        const basicProperties = this.getBasicProperties().filter((bp) => bp.name === name);
        return basicProperties.pop(); // Get latest one in case of inheritance.
    }

    getBasicPropertyById(id) {
        const basicProperties = this.getBasicProperties().filter((bp) => bp.id === id);
        return basicProperties.pop(); // Get latest one in case of inheritance.
    }

    getEnums(ignoreInheritedEnums) {
        if (!ignoreInheritedEnums && this.hasParentClass()) {
            return nonDuplicate(this.getParentClass().getEnums(), this.enums);
        } else {
            return _.clone(this.enums);
        }
    }

    getEnumByName(name) {
        return this.getEnums().filter((e) => e.name === name).pop();
    }

    getPageView(viewName, defaultViewName) {
        // Get the last items instead of the first one with `.find()`
        const foundPageViews = this.getPageViews(/* true */).filter((pageView) => pageView.name === viewName);
        if (foundPageViews.length) {
            return foundPageViews[foundPageViews.length - 1];
        } else if (defaultViewName) {
            return this.getPageView(defaultViewName);
        } else {
            return this.getDefaultPageView();
        }
    }

    getPageViewByNames(...pageViewNames) {
        const pageViews = this.getPageViews();
        return pageViewNames.reduce(
            (memo, pageViewName) => memo || pageViews.find((pageView) => pageView.name === pageViewName)
            ,
            null
        );
    }

    getPageViews(ignoreInheritedPageViews) {
        if (!ignoreInheritedPageViews && this.hasParentClass()) {
            return nonDuplicate(this.getParentClass().getPageViews(), this.pageViews);
        } else {
            return this.pageViews;
        }
    }

    getDefaultPageView() {
        for (var idx = 0; idx < this.pageViews.length; idx++) {
            if (this.pageViews[idx].isDefault) {
                return this.pageViews[idx];
            }
        }
        if (this.hasParentClass()) {
            return this.getParentClass().getDefaulPageViews();
        } else {
            return null;
        }
    }

    getTableViews(ignoreInheritedTableViews) {
        if (!ignoreInheritedTableViews && this.hasParentClass()) {
            return nonDuplicate(this.getParentClass().getTableViews(), this.tableViews);
        } else {
            return this.tableViews;
        }
    }

    getDefaultTableView() {
        for (var idx = 0; idx < this.tableViews.length; idx++) {
            if (this.tableViews[idx].isDefault) {
                return this.tableViews[idx];
            }
        }
        if (this.hasParentClass()) {
            return this.getParentClass().getDefaulTableViews();
        } else {
            return null;
        }
    }

    getRelationships(ignoreInheritedRelationships) {
        if (!ignoreInheritedRelationships && this.hasParentClass()) {
            return nonDuplicate(this.getParentClass().getRelationships(), this.relationships);
        } else {
            return _.clone(this.relationships);
        }
    }

    getRelationshipById(id) {
        id = parseInt(id, 10);
        const relationships = this.getRelationships().filter((rel) => rel.id === id);
        return relationships.pop(); // Get latest one in case of inheritance.
    }

    getRelationshipByName(relationshipName) {
        const relationships = this.getRelationships().filter((rel) => rel.name === relationshipName);
        return relationships.pop(); // Get latest one in case of inheritance.
    }

    getAggregations(ignoreInheritedAggregations) {
        const aggregations = this.relationships.filter((relationship) => relationship.isAggregation);

        if (!ignoreInheritedAggregations && this.hasParentClass()) {
            return nonDuplicate(this.getParentClass().getAggregations(), aggregations);
        } else {
            return aggregations;
        }
    }

    getAssociations(ignoreIngeritedAssociations) {
        const associations = this.relationships.filter((relationship) => !relationship.isAggregation);

        if (!ignoreIngeritedAssociations && this.hasParentClass()) {
            return nonDuplicate(this.getParentClass().getAssociations(), associations);
        } else {
            return associations;
        }
    }

    // TBD: What about multiple levels of inheritance...? (eg C is B, B is A?)
    getAllDerivedEntities() {
        // Return all entities that inherit from this entity
        var domain = this.parent;
        var derivedEntities = [];
        for (var i in domain.entities) {
            var entity = domain.entities[i];
            if (entity.hasParentClass()) {
                var parent = entity.getParentClass();
                if (this.compareToMyID(parent.id)) {
                    derivedEntities.push(entity);
                }
            }
        }
        return derivedEntities;
    }

    // TBD - support inheritance!
    getAllParentAggregations() {
        // Return all aggregations which link to this entity (returns the aggregation, not the parent entity!)
        var domain = this.parent;
        var parentAggs = [];
        var entities = domain.getEntities();
        for (var i in entities) {
            var entity = entities[i];
            var aggRels = entity.getAggregations();
            for (var k in aggRels) {
                var rel = aggRels[k];
                if (rel.hasTargetEntity() && this.compareToMyID(rel.getTargetEntity().id)) {
                    parentAggs.push(rel);
                }
            }
        }
        return parentAggs;
    }

    processLocalTemplateFunctions(template) {
        var children = [
            // Without parent elements...
            [ "BasicProperty", this.getBasicProperties(true) ],
            [ "Enumeration", this.getEnums(true) ],
            [ "Relationship", this.getRelationships(true) ],
            [ "Aggregation", this.getAggregations(true) ],
            [ "Association", this.getAssociations(true) ],
            [ "PageView", this.getPageViews(true) ],
            [ "TableView", this.getTableViews(true) ],
            // ...and the same *with* parent elements:
            [ "BasicProperty!", this.getBasicProperties(false) ],
            [ "Enumeration!", this.getEnums(false) ],
            [ "Relationship!", this.getRelationships(false) ],
            [ "Aggregation!", this.getAggregations(false) ],
            [ "Association!", this.getAssociations(false) ],
            [ "PageView!", this.getPageViews(false) ],
            [ "TableView!", this.getTableViews(false) ]
            // Notice that the !-operator can be combined with the ?-operator
            // Example: {{Enumeration!?}}...{{Enumeration!}}...{{/Enumeration!}}...{{/Enumeration!?}}
        ];

        template = this.processTemplateWithChildElements(template, children);
        return super.processLocalTemplateFunctions(template);
    }

    addNewBasicProperty(name, desc, propertyType) {
        var id = this.getDomain().createNewID();
        var newBasicProperty = new BasicProperty(this, id, name, desc, propertyType);
        this.basicProperties.push(newBasicProperty);
        return newBasicProperty;
    }

    addNewEnum(name, desc) {
        var id = this.getDomain().createNewID();
        var newEnum = new Enumeration(this, id, name, desc);
        this.enums.push(newEnum);
        return newEnum;
    }

    addNewRelationship(target, isAggregation, name) {
        var id = this.getDomain().createNewID();
        if (!name) {
            name = target.namePlural;
        }
        var newRelationship = new Relationship(this, target, id, isAggregation, name);
        this.relationships.push(newRelationship);
        return newRelationship;
    }

    addNewPageView(name, desc) {
        var id = this.getDomain().createNewID();
        var newPageView = new views.PageView(this, id, name, desc);

        this.pageViews.push(newPageView);
        return newPageView;
    }

    addNewTableView(name, desc) {
        var id = this.getDomain().createNewID();
        var newTableView = new views.TableView(this, id, name, desc);
        this.tableViews.push(newTableView);
        return newTableView;
    }

    getAllElements(includeSelf) {
        var i;
        var r = [];
        if (includeSelf) {
            r = r.concat(this);
        }
        // Add children with no own children directly:
        r = r.concat(this.relationships);
        r = r.concat(this.basicProperties);
        // Children with children:
        for (i in this.enums) {
            r = r.concat(this.enums[i].getAllElements(true));
        }
        for (i in this.pageViews) {
            r = r.concat(this.pageViews[i].getAllElements(true));
        }
        for (i in this.tableViews) {
            r = r.concat(this.tableViews[i].getAllElements(true));
        }
        return r;
    }

    getChildEntities(recursive, flatten) {
        const domain = this.getDomain();
        const childEntities = domain.getEntities()
            .filter((entity) => entity.hasParentClass() && entity.getParentClass() && entity.getParentClass().id === this.id);
        if (recursive) {
            if (flatten) {
                return childEntities.reduce((memo, entity) => memo.concat(entity.getChildEntities(recursive, flatten)), [].concat(childEntities));
            }
            childEntities.forEach((entity) => {
                entity.children = entity.getChildEntities(recursive, flatten);
            });
            return childEntities;
        }
        return childEntities;
    }

    async createDocument(persistence, instance) {
        instance.lastUpdated = (new Date()).toISOString();
        return persistence.save(this.getBaseClass().name, instance);
    }

    async removeDocument(persistence, instance) {
        // TODO: Remove the associations.
        return persistence.remove(this.getBaseClass().name, instance);
    }

    async updateDocument(persistence, instance, notifyUsers) {
        instance.lastUpdated = (new Date()).toISOString();
        if (notifyUsers) {
            await this.notifyUsers(persistence, instance);
        }
        return persistence.update(this.getBaseClass().name, instance);
    }

    toString(t) {
        if (!t) {
            return "";
        }

        const name = (this.isRootInstance ? '#' : '') + this.name;

        switch (t) {
            case Entity.TO_STRING_TYPES.PROPERTIES:
                const fullName = []
                    .concat(name)
                    .concat(`@${this.id}`)
                    .concat(this.hasParentClass() ? `(${this.getParentClass().name})` : [])
                    .join('')
                ;

                const basicPropertiesAndEnumerations = []
                    .concat(this.basicProperties.map((bp) => bp.toString()).filter((s) => s))
                    .concat(this.enums.map((e) => e.toString()).filter((s) => s))
                    .join(', ')
                ;

                return []
                    .concat(fullName)
                    .concat(basicPropertiesAndEnumerations || [])
                    .join(': ')
                ;

            case Entity.TO_STRING_TYPES.AGGREGATIONS:
                const aggregations = this.relationships.filter((r) => r.isAggregation).map((r) => r.toString()).filter((s) => s).join(', ');
                return aggregations ? `${name}: { ${aggregations} }` : "";

            case Entity.TO_STRING_TYPES.ASSOCIATIONS:
                const associations = this.relationships.filter((r) => !r.isAggregation).map((r) => r.toString()).filter((s) => s).join(', ');
                return associations ? `${name}: ${associations}` : "";

            default:
                throw new WarpWorksError("Invalid option: " + t);
        }
    }

    baseJSON() {
        return _.extend({}, super.toJSON(), {
            isRootEntity: this.isRootEntity,
            isRootInstance: this.isRootInstance,
            isAbstract: this.isAbstract,
            entityType: this.entityType,
            namePlural: this.namePlural
        });
    }

    toJSON() {
        return _.extend({}, this.baseJSON(), {
            parentClass: this.hasParentClass() ? [ this.getParentClass().id ] : [],

            basicProperties: utils.mapJSON(this.basicProperties),
            enums: utils.mapJSON(this.enums),
            relationships: utils.mapJSON(this.relationships),
            pageViews: utils.mapJSON(this.pageViews),
            tableViews: utils.mapJSON(this.tableViews)
        });
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.isRootEntity = json.isRootEntity;
        this.isRootInstance = json.isRootInstance;
        this.isAbstract = json.isAbstract;
        this.entityType = json.entityType;
        this.namePlural = json.namePlural;
        this.parentClass = json.parentClass; // Convert OID to reference later!

        this.basicProperties = this.fromJsonMapper(BasicProperty, json.basicProperties);
        this.enums = this.fromJsonMapper(Enumeration, json.enums);
        this.relationships = this.fromJsonMapper(Relationship, json.relationships);
        this.pageViews = this.fromJsonMapper(PageView, json.pageViews);
        this.tableViews = this.fromJsonMapper(TableView, json.tableViews);
    }

    static fromFileJSON(json, parent) {
        super.validateFromFileJSON(json, TYPE);

        const instance = new Entity(parent, json.id, json.name, json.desc);
        instance.fromJSON(json);
        return instance;
    }

    toResource(instance, lastDocumentLevelHref, domain, routes, isStudio) {
        domain = domain || this.getDomain().name;
        let resource;

        if (instance) {
            lastDocumentLevelHref = this.isDocument()
                ? isStudio
                    ? RoutesInfo.expand(routes.instance, { domain, type: this.name, id: instance.id })
                    : RoutesInfo.expand('W2:content:instance', { domain, type: instance.type, id: instance.id })
                : lastDocumentLevelHref;

            const href = isStudio
                ? RoutesInfo.expand(routes.instance, { domain, type: this.name, id: instance.id })
                : RoutesInfo.expand('W2:content:instance', { domain, type: instance.type, id: instance.id })
            ;

            resource = warpjsUtils.createResource(href, {
                domain,
                type: instance.type,
                id: instance.id,
                relnDesc: instance.relnDesc,
                relnPosition: instance.relnPosition,
                displayName: this.getDisplayName(instance),
                version: instance.Version || DEFAULT_VERSION
            });

            this.getBasicProperties().forEach((basicProperty) => {
                resource[basicProperty.name] = basicProperty.getValue(instance);
            });
        } else {
            // TODO: Check if this block is ever used.
            const selfHref = RoutesInfo.expand('W2:content:entity', {
                domain,
                type: this.name
            });
            resource = warpjsUtils.createResource(selfHref, this.baseJSON());

            resource.link('instances', RoutesInfo.expand('W2:content:instances', {
                domain,
                type: this.name
            }));
        }
        return resource;
    }

    toFormResourceBase() {
        return _.extend({}, super.toFormResourceBase(), {
            isRootEntity: this.isRootEntity,
            isRootInstance: this.isRootInstance,
            isAbstract: this.isAbstract,
            entityType: this.entityType,
            namePlural: this.namePlural
        });
    }

    async toFormResource(persistence, instance, docLevel, docs, relativeToDocument) {
        const domain = this.getDomain().name;

        if (this.isDocument()) {
            const href = RoutesInfo.expand('W2:content:entities', { domain, type: this.name });
            const resource = warpjsUtils.createResource(href, _.extend({}, this.toFormResourceBase(), {
            }));
            const basicProperties = this.getBasicProperties()
                .filter((basicProperty) => !basicProperty.isPassword())
                .map((basicProperty) => basicProperty.name);

            const existingDocs = docs.filter((doc) => doc.id && doc.type);

            const data = existingDocs.map((doc) => [
                RoutesInfo.expand('W2:content:instance', {
                    domain,
                    type: doc.type,
                    id: doc.id
                })
            ].concat(basicProperties.map((basicProperty) => doc[basicProperty])));

            resource.tableView = {
                basicProperties,
                data
            };

            resource.data = data;

            const entities = existingDocs.map((doc) => {
                const resource = this.toResource(doc, relativeToDocument.href);
                resource.docLevel = docLevel.concat(`Entity:${doc.id}`).join('.');
                return resource;
            });
            resource.embed('entities', entities);

            // Find inherited classes.
            const subEntities = this.getChildEntities(true, true);
            if (subEntities.length) {
                resource.embed('subEntities', subEntities.map((subEntity) => ({
                    id: subEntity.id,
                    name: subEntity.name,
                    label: this.getDisplayName(subEntity)
                })));
            }

            return resource;
        } else {
            const resource = warpjsUtils.createResource(relativeToDocument.href, this.baseJSON());
            const pv = this.getPageView(config.views.content);

            resource.data = await Promise.map(docs,
                async (doc, indexPosition) => {
                    const subData = await pv.toFormResource(persistence, doc, docLevel.concat(`Entity:${doc._id}`), relativeToDocument);
                    return _.extend({}, subData, { indexPosition });
                }
            );

            return resource;
        }
    }

    async toStudioResource(persistence, instance, docLevel, relativeToDocument, routes, docs, style) {
        const domain = relativeToDocument.domain;

        const href = this.isDocument()
            ? RoutesInfo.expand(routes.entities, { domain, type: this.name })
            : relativeToDocument.href;

        const resource = warpjsUtils.createResource(href, _.extend({}, this.toFormResourceBase(), {
        }));

        const existingDocs = docs
            .filter((doc) => doc.id && doc.type)
            .sort(warpjsUtils.byPositionThenName)
        ;

        if (style === RELATIONSHIP_PANEL_ITEM_STYLES.Table) {
            // FIXME: Do not take the basic properties, but DefaultTableView of
            // the current entity.
            const basicProperties = this.getBasicProperties()
                .filter((basicProperty) => !basicProperty.isPassword())
                .map((basicProperty) => basicProperty.name)
            ;

            const data = existingDocs.map((doc) => [
                RoutesInfo.expand(routes.instance, {
                    domain,
                    type: doc.type,
                    id: doc.id
                })
            ].concat(basicProperties.map((basicProperty) => doc[basicProperty])));

            resource.tableView = {
                basicProperties,
                data
            };

            resource.data = data;

            const entities = existingDocs.map((doc) => {
                // FIXME: This points to /content
                const docResource = this.toResource(doc, relativeToDocument.href, relativeToDocument.domain, routes, true);
                docResource.docLevel = docLevel.addEntity(doc.id).toString();
                return docResource;
            });
            resource.embed('entities', entities);

            return resource;
        } else if (style === RELATIONSHIP_PANEL_ITEM_STYLES.Csv) {
            const entities = await Promise.map(
                existingDocs,
                async (doc) => {
                    const docResource = await this.toResource(doc, relativeToDocument.href, relativeToDocument.domain, routes, true);
                    docResource.docLevel = docLevel.addEntity(doc.id).toString();
                    return docResource;
                }
            );

            resource.embed('entities', entities);
            return resource;
        } else if (style === RELATIONSHIP_PANEL_ITEM_STYLES.Carousel) {
            const pageView = this.getPageView(config.views.content);
            const data = await Promise.map(
                docs,
                async (doc, indexPosition) => {
                    const newDocLevel = docLevel.addEntity(doc._id || doc.id || String(doc.warpjsId));
                    return pageView.toStudioResource(persistence, doc, newDocLevel, relativeToDocument, routes);
                }
            );

            resource.data = data; // FIXME: embed
            return resource;
        } else {
            throw new Error(`Need to implement for style='${style}'.`);
        }
    }

    async patch(updatePath, updatePathLevel, instance, updateValue, patchAction) {
        // debug(`patch(): entity=${this.name}; updatePath=${updatePath}; updatePathLevel=${updatePathLevel}; instace=`, instance);
        const currentPatch = updatePathInfo(updatePath, updatePathLevel);

        if (currentPatch[0] === 'Basic') {
            // Basic, no need for the wrapper.
            const model = this.getBasicPropertyByName(currentPatch[1]);
            return model.patch(updatePath, updatePathLevel + 1, instance, updateValue);
        } else if (currentPatch[0] === 'Relationship') {
            const relationship = this.getRelationshipByName(currentPatch[1]);
            return relationship.patch(updatePath, updatePathLevel + 1, instance, updateValue, patchAction);
        } else if (currentPatch[0] === 'Enum') {
            const model = this.getEnumByName(currentPatch[1]);
            return model.patch(updatePath, updatePathLevel + 1, instance, updateValue);
        } else {
            throw new Error(`TODO: currentPatch=${currentPatch.join(':')}`);
        }
    }

    async addData(updatePath, updatePathLevel, instance, updateValue) {
        const currentPatch = updatePathInfo(updatePath, updatePathLevel);

        if (currentPatch[0] === 'Relationship') {
            const relationship = this.getRelationshipByName(currentPatch[1]);
            return relationship.addData(instance, updateValue);
        } else {
            throw new Error(`TODO: currentPatch=${currentPatch.join(':')}`);
        }
    }

    createSiblingForInstance(instance) {
        if (instance.isRootInstance) {
            throw new WarpWorksError("Cannot create sibling for rootInstance.");
        }
        return _.pick(instance, [
            'type',
            'parentID',
            'parentRelnID',
            'parentRelnName',
            'parentBaseClassID',
            'parentBaseClassName'
        ]);
    }

    _setDefaultValues(newInstance) {
        newInstance.type = this.name;
        newInstance.typeID = this.id;

        this.getBasicProperties().forEach((prop) => {
            newInstance[prop.name] = prop.newInstance();
        });

        this.getEnums().forEach((prop) => {
            newInstance[prop.name] = prop.newInstance();
        });

        this.getRelationships().forEach((reln) => {
            reln.newInstance(newInstance);
        });

        return newInstance;
    }

    /**
     *  This is used to create Level1 document (studio instance).
     */
    createChildForInstance(instance, relationship, newId) {
        // console.log("createChildForInstance(): relationship=", relationship);
        return relationship.getTargetEntity()._setDefaultValues({
            warpjsId: newId,
            parentID: instance.id,
            parentRelnID: relationship.id,
            parentRelnName: relationship.name,
            parentBaseClassID: this.id,
            parentBaseClassName: this.name
        });
    }

    /**
     *  This is used to create Level2 document (content instance).
     */
    createContentChildForRelationship(relationship, parentEntity, parentInstance) {
        return this._setDefaultValues({
            parentID: parentInstance.id,
            parentRelnID: relationship.id,
            parentRelnName: relationship.name,
            parentBaseClassID: parentEntity.id,
            parentBaseClassName: parentEntity.name
        });
    }

    async createStudioChild(persistence, instance, relationship, newId) {
        const targetEntity = relationship.getTargetEntity();
        switch (targetEntity.name) {
            case ComplexTypes.BasicProperty:
                const basicProperty = new BasicProperty(this, newId, "newBasicProperty");
                return basicProperty.save(persistence, instance.id);

            case ComplexTypes.Relationship:
                const newRelationship = new Relationship(this, null, newId, false, "newRelationship");
                return newRelationship.save(persistence, instance.id);

            case ComplexTypes.Enumeration:
                const newEnumeration = new Enumeration(this, newId, "newEnumeration");
                return newEnumeration.save(persistence, instance.id);

            default:
                throw new Error(`TODO: Implementation for targetEntity.name=${targetEntity.name}`);
        }
    }

    addEmbedded(instance, docLevel, level) {
        const currentPatch = updatePathInfo(docLevel, level);
        const relationshipEntity = this.getRelationshipByName(currentPatch[1]);

        ensureInstanceEmbedded(instance);
        return relationshipEntity.addEmbedded(instance.embedded, docLevel, level);
    }

    removeEmbedded(instance, docLevel, level) {
        const currentPatch = updatePathInfo(docLevel, level);
        const relationshipEntity = this.getRelationshipByName(currentPatch[1]);

        ensureInstanceEmbedded(instance);
        instance.embedded = relationshipEntity.removeEmbedded(instance.embedded, docLevel, level);

        return instance;
    }

    async getParentEntity(instance) {
        const domain = await this.getDomain();
        return domain.getEntityById(instance.parentBaseClassID);
    }

    async getParentInstance(persistence, instance) {
        const parentEntity = await this.getParentEntity(instance);
        return parentEntity.getDocuments(persistence, { _id: instance.parentID }, true);
    }

    getChildElements(ignoreInherited) {
        return []
            .concat(this.getBasicProperties(ignoreInherited))
            .concat(this.getRelationships(ignoreInherited))
            .concat(this.getEnums(ignoreInherited))
            .concat(this.getPageViews(ignoreInherited))
            .concat(this.getTableViews(ignoreInherited));
    }

    /**
     *  Used for first import of schema.
     */
    async save(persistence, domainPersistenceId) {
        const entityPersistenceId = await super.save(persistence, domainPersistenceId);

        await Promise.each(
            this.getChildElements(true),
            async (model) => model.save(persistence, entityPersistenceId)
        );

        return entityPersistenceId;
    }

    /**
     *  Used when updating a schema
     */
    async updateSchema(persistence) {
        debug(`updateSchema(): START`);
        await super.updateSchema(persistence);
        await Promise.each(this.getChildElements(true), async (model) => model.updateSchema(persistence));
        debug(`updateSchema(): END`);
    }

    toPersistenceJSON() {
        const json = _.extend({}, super.toPersistenceJSON(), {
            // For persistence
            id: this.persistenceId,
            lastUpdated: this.lastUpdated,

            // From constructor
            isAbstract: this.isAbstract,
            namePlural: this.namePlural,
            isRootEntity: this.isRootEntity,
            isRootInstance: this.isRootInstance,
            entityType: this.entityType,
            parentClass: this.hasParentClass() ? this.getParentClass().idToJSON() : null,

            parentRelnID: 9,
            parentRelnName: 'entities',
            parentBaseClassID: 6,
            parentBaseClassName: 'Domain'
        });

        return json;
    }

    static async getPersistenceDocuments(persistence, parentID) {
        return persistence.documents(TYPE, { parentID }, true);
    }

    async fromPersistenceJSON(persistence, json) {
        await super.fromPersistenceJSON(persistence, json);

        this.isAbstract = json.isAbstract;
        this.entityType = json.entityType;
        this.namePlural = json.namePlural;
        this.isRootEntity = json.isRootEntity;
        this.isRootInstance = json.isRootInstance;
        this.persistenceId = json.id;
        this.setParentClass(json.parentClass); // Convert OID to reference later!

        // Basic properties
        await this.fromPersistenceCollection(persistence, BasicProperty, 'basicProperties');

        // Enumerations
        await this.fromPersistenceCollection(persistence, Enumeration, 'enums');

        // Relationships
        await this.fromPersistenceCollection(persistence, Relationship, 'relationships');

        // Page views
        await this.fromPersistenceCollection(persistence, views.PageView, 'pageViews');

        // Table views
        await this.fromPersistenceCollection(persistence, views.TableView, 'tableViews');

        return this;
    }

    static async instantiateFromPersistenceJSON(persistence, json, parent) {
        // debug(`instantiateFromPersistenceJSON(): json=`, json);
        const instance = new Entity(parent, json.warpjsId, json.name, json.desc);

        return instance.fromPersistenceJSON(persistence, json);
    }

    /**
     *  Gets all children of the given parent.
     *
     *  @param {objec} persistence: Persistance instance.
     *  @param {string|object} parentData: Search criteria. If a string, it's
     *      expected to be the `parentID`.
     *  @returns {Promise} The list of documents for a given parent.
     */
    async getChildren(persistence, parentData) {
        if (typeof parentData === 'string') {
            parentData = { parentID: parentData };
        }
        const docs = await persistence.documents(this.getBaseClass().name, parentData, true);
        return docs.sort(warpjsUtils.byPositionThenName);
    }

    async clone(persistence, instance, parentID, version) {
        let clone = _.pick(instance, [
            'parentID',
            'parentRelnID',
            'parentRelnName',
            'parentBaseClassID',
            'parentBaseClassName',
            'type',
            'typeID'
        ]);

        if (this.isDocument() && parentID) {
            clone.parentID = parentID;
        }

        // Basic Properties
        await Promise.each(
            this.getBasicProperties(),
            async (basicProperty) => basicProperty.clone(persistence, instance, clone)
        );

        // Replace the Name only for the top document.
        if (this.isDocument() && !parentID) {
            clone.Name = 'ChangeThisName';
        }

        // Enumerations
        await Promise.each(
            this.getEnums(),
            async (enumeration) => enumeration.clone(persistence, instance, clone)
        );

        if (this.isDocument()) {
            clone = await this.createDocument(persistence, clone);
        } else {
            clone._id = uuid();
        }

        // Relationships
        await Promise.each(
            this.getRelationships(),
            async (relationship) => relationship.clone(persistence, instance, clone, version)
        );

        if (this.isDocument() && version) {
            // If a version clone is created, we want to keep the same name.
            if (!parentID) {
                const nameBasicProperty = this.getBasicPropertyByName('Name');
                const currentName = nameBasicProperty.getValue(instance);
                nameBasicProperty.setValue(clone, currentName);
            }

            // If the entity has a basic property named Version, set the version
            // to the passed value.
            const versionBasicProperty = this.getBasicPropertyByName('Version');
            if (versionBasicProperty) {
                versionBasicProperty.setValue(clone, version);
            }

            // The new clone should be set to Draft.
            const statusEnum = this.getEnumByName('Status');
            if (statusEnum) {
                const currentStatus = statusEnum.getValue(instance);
                if (!parentID || (currentStatus !== DOCUMENT_STATUS.INHERITANCE)) {
                    statusEnum.setValue(clone, DOCUMENT_STATUS.NEW_VERSION_STATUS);
                }
            }

            // If the entity has a relationship named Predecessor, set the
            // association to the current instance.
            const predecessorRelationship = this.getRelationshipByName('Predecessor');
            if (predecessorRelationship) {
                // The precessor association should be cleaned.
                const previousPredecessor = predecessorRelationship.getTargetReferences(clone);
                for (let i = previousPredecessor.length - 1; i >= 0; i--) {
                    previousPredecessor.splice(i, 1);
                }

                const data = {
                    id: instance.id,
                    type: instance.type,
                    typeID: instance.typeID || this.id,
                    desc: "Created by new version",
                    position: 0
                };

                await predecessorRelationship.addAssociation(clone, data, persistence);
            }
        }

        if (this.isDocument()) {
            await this.updateDocument(persistence, clone);
        }

        return clone;
    }

    async notifyUsers(persistence, instance) {
        if (!this.isDocument()) {
            return;
        }

        const domain = this.getDomain();
        const userEntity = domain.getEntityByName('User');

        const authorsRelationship = this.getRelationshipByName('Authors');
        await notifyUsersByRelationship(persistence, domain.name, instance, authorsRelationship, 'author');

        const contributorsRelationship = this.getRelationshipByName('Contributors');
        await notifyUsersByRelationship(persistence, domain.name, instance, contributorsRelationship, 'contributor');

        const followsRelationship = userEntity.getRelationshipByName('Follows');
        const followsReverseRelationship = followsRelationship.getReverseRelationship();
        await notifyUsersByRelationship(persistence, domain.name, instance, followsReverseRelationship, 'follow');
    }
}

const notifyUsersByRelationship = async (persistence, domainName, changedDocument, relationship, relnType) => {
    debug(`notifyUsersByRelationship(): domainName=${domainName}`);
    const usersToNotify = relationship
        ? await relationship.getDocuments(persistence, changedDocument)
        : []
    ;

    await Promise.each(usersToNotify, async (userToNotify) => Notification.addToUser(persistence, domainName, userToNotify, changedDocument, relnType));
};

Entity.TO_STRING_TYPES = {
    PROPERTIES: 'properties',
    AGGREGATIONS: 'aggregations',
    ASSOCIATIONS: 'associations'
};

module.exports = Entity;
