//
// Class EntityProxy
//

function EntityProxy(type, isDocument, mode, parentRelnProxy) {
    this.type = type;
    this.isDocument = isDocument;
    if (this.isDocument)
        this.isDirty = false;
    this.mode = mode ? mode : "undefined";

    this.data = null;
    this.parentRelnProxy = parentRelnProxy;
    this.relationships = {};
    this.history = [];

    $warp.entityCache.push(this);
}

EntityProxy.prototype.getParentRelationship = function () {
    return this.parentRelnProxy;
}

EntityProxy.prototype.getParentEntity = function () {
    return this.getParentRelationship().getParentEntity();
}

EntityProxy.prototype.getDocument = function() {
    if (this.isDocument)
        return this;
    else
        return this.getParentEntity().getDocument();
}

EntityProxy.prototype.useData = function(callback) {
    if (this.data) {
        callback(this);
        return;
    }

    var validateAndCall = function (data) {
        if (data) {
            this.data = data;
            callback(this);
        }
        else
            callback(null);
    }.bind(this);

    switch (this.mode) {
        case "rootInstance":
            this.getDataViaRootInstance(validateAndCall);
            break;
        case "editEntity":
            if (this.oid) {
                this.getDataViaOID(validateAndCall);
                break;
            }
            else
                throw "'editEntity' must provide oid!";
            break;
        case "addNewEntity":
            throw "TBD!";
            break;
        default:
            throw "Invalid mode for entity: '" + this.mode + "'";
    }
}

EntityProxy.prototype.getValue = function(attrName) {
    if (!this.data || !this.data[attrName])
        warptrace(1, "EntityProxy.getValue():\n- Warning: Can not access value - "+attrName);
    warptrace(2, "EntityProxy.getValue():\n- Getting value for "+attrName+": "+this.data[attrName])
    return this.data[attrName];
}

EntityProxy.prototype.setValue = function(attrName, val) {
    if (!this.data || !this.data[attrName])
        warptrace(1, "EntityProxy.setValue():\n- Warning: Can not access value - "+attrName);
    if (this.data[attrName] !== val) {
        this.history.push({ date: new Date(), attribute: attrName, newVal: val });
        this.data[attrName] = val;
        this.getDocument().isDirty = true;
    }
}


EntityProxy.prototype.displayName = function() {
    if (!this.data)
        return this.type+": No data available";
    return this.type + "[" + this.data._id + "]";
}

EntityProxy.prototype.addRelationshipProxy = function(relnProxy) {
    this.relationships[relnProxy.id] = relnProxy;
}

EntityProxy.prototype.getRelationshipProxy = function(relnID) {
    if (this.relationships[relnID])
        return this.relationships[relnID];
    // Else, create new proxy:
    var jsonReln = $warp.model.getRelationshipByID(relnID);
    var newRP = new RelationshipProxy(jsonReln, this);
    this.relationships[relnID] = newRP;
    return newRP;
}

EntityProxy.prototype.getDataViaOID = function(callback) {
    throw "TBD!";
}

EntityProxy.prototype.getDataViaRootInstance = function(callback) {
    if (this.data) {
        callback(this);
        return;
    }
    if (!$warp.domain) throw "Can not use root instance without domain!";

    var reqData = {
        commandList: [
            {
                command: "GetRootInstance",
                domain: $warp.domain,
                targetType: $warp.domain
            }
        ]
    };

    $warp.processCRUDcommands(reqData, function (result) {
        if (result.success) {
            if (!result.resultList || result.resultList.length != 1) {
                alert("Could not find RootInstance - potential Server error");
                return;
            }
            if (result.resultList[0].error) {
                alert(result.resultList[0].status);
                return;
            }
            var rootInstanceFromServer = result.resultList[0].rootInstance;
            callback(rootInstanceFromServer);
        }
        else {
            alert(result.err);
        }
    });
}

//
// Class "RelationshipProxy"
//

function RelationshipProxy(jsonReln, parentEntityProxy) {
    this.parentEntityProxy = parentEntityProxy;
    this.jsonReln = jsonReln;

    this.name = jsonReln.name;
    this.id = jsonReln.id;
    this.isAggregation = jsonReln.isAggregation;
    this.targetEntityDefinition = $warp.model.getEntityByID (jsonReln.targetEntity[0]);
    this.targetType = this.targetEntityDefinition.name;
    this.targetIsDocument = this.targetEntityDefinition.entityType === "Document";
    this.parentType = $warp.model.getRelnParentByID (jsonReln.id).name;

    this.requiresUpdate = true;
    this.currentPage = 0;
    this.entitiesPerPage = 5;
    this.maxNumberOfPages = 5;
    this.selectedEntityIdx = -1;
    this.filter = null;

    this.queryResults = [];
    this.queryResultsCount = -1;

    // Used only for associations, to determine potential targets:
    this.assocTargets = [];

    warptrace(2, "RelationshipProxy():\n-  New proxy for "+this.jsonReln.name);
}

RelationshipProxy.prototype.toString = function (spacing) {
    var spaces = "";
    for (var idx = 0; idx<spacing; idx++) spaces += " ";
    var str = "\n" + spaces + " - RelnProxy [" + this.name+"/" + this.id+"]: len="+this.queryResults.length+", idx="+this.selectedEntityIdx;
    return str;
}

RelationshipProxy.prototype.updateConfig = function (cfg) {
    this.requiresUpdate = true;
    this.entitiesPerPage = cfg.entitiesPerPage;
    this.maxNumberOfPages = cfg.maxNumberOfPages;
}

RelationshipProxy.prototype.setFilter = function (f) {
    this.requiresUpdate = true;
    this.filter = f;
    this.currentPage = 0;
}

RelationshipProxy.prototype.getParentEntity = function () {
    return this.parentEntityProxy;
}

RelationshipProxy.prototype.setSelectedEntity = function (idx) {
    if (idx<0 || idx>this.queryResults.length)
        warptrace(3, "RelationshipProxy.setSelectedEntity: Warning - selectedEntityIdx is out of bounds!");
    this.selectedEntityIdx = idx;
}

RelationshipProxy.prototype.selectEntity = function (selection) {
    var absolutePos = this.currentPage * this.entitiesPerPage + this.selectedEntityIdx;
    if (selection === "+1") {
        if (absolutePos === this.queryResultsCount - 1) {
            // We have reached the end, start at beginning
            this.selectedEntityIdx = 0;
            this.currentPage = 0;
            this.requiresUpdate = true;
        }
        else if (this.selectedEntityIdx < this.entitiesPerPage - 1) {
            // Next element on same page
            this.selectedEntityIdx++;
        }
        else if (this.selectedEntityIdx === this.entitiesPerPage - 1) {
            // End of this page, start with next page
            this.currentPage++;
            this.selectedEntityIdx = 0;
            this.requiresUpdate = true;
            if (this.currentPage > this.queryResultsCount / this.entitiesPerPage)
                this.currentPage = 0;
        }
        else throw "RelationshipProxy.selectEntity(): Internal error - case not covered!"
    }
    else if (selection === "-1") {
        if (absolutePos === 0) {
            // We have reached the beginning, continue at the end
            this.currentPage = Math.round(this.queryResultsCount / this.entitiesPerPage) - 1;
            this.selectedEntityIdx = this.queryResultsCount - this.currentPage * this.entitiesPerPage - 1;
            this.requiresUpdate = true;
        }
        else if (this.selectedEntityIdx > 0) {
            // Previous element on same page
            this.selectedEntityIdx--;
        }
        else if (this.selectedEntityIdx === 0) {
            // Beginning of this page, continue on prev. page
            this.currentPage--;
            this.selectedEntityIdx = this.entitiesPerPage - 1;
            this.requiresUpdate = true;
        }
        else throw "RelationshipProxy.selectEntity(): Internal error - case not covered!"
    }
    else if (typeof selection === "number") {
        if (selection < 0 || selection >= this.entitiesPerPage)
            throw "RelationshipProxy.selectEntity() - Selection out of bounds: "+selection;
        this.selectedEntityIdx = selection;
    }
    else
        throw "RelationshipProxy.selectEntity() - Not supported: "+selection;
}

RelationshipProxy.prototype.getProxyForSelectedEntity = function () {
    if (this.queryResults[this.selectedEntityIdx])
        return this.queryResults[this.selectedEntityIdx];
    warptrace(1, "RelationshipProxy.getProxyForSelectedEntity():\n- Warning: Can´t get Porxy for selected entity!");
    return null;
}

RelationshipProxy.prototype.removeFromAssocTargets = function (id) {
    var newSelections = [];
    for (var i in this.assocTargets) {
        if (this.assocTargets[i].id !== id)
            newSelections.push(this.assocTargets[i]);
    }
    this.assocTargets = newSelections;
}

RelationshipProxy.prototype.getNonAbstractEntities = function (callback) {
    // TBD - xxx - fix this / needed...? => TinyMC?
    if (!this.requiresUpdate) {
        callback (this);
        return;
    }

    var cmdList = {
        commandList: [
            {
                domain: $warp.domain,
                targetType: this.targetType,
                command: "SearchForTargetEntity",
                filter: this.filter
            }
        ]
    };
    reqData = JSON.stringify(cmdList, null, 2);

    $.ajax({
        url: $warp.links.crud.href,
        type: 'POST',
        data: reqData,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (result) {
            if (result.success) {
                var queryResults = [];
                var queryResultsCount = result.resultList[0].queryResultsCount;
                result.resultList[0].queryResult.forEach (function (queryResult) {
                    warptrace(3, "RelationshipProxy.getNonAbstractEntities():\n-  Result - "+queryResult["_id"]+" - "+queryResult.type);
                });
                this.requiresUpdate = false;
                callback();
            }
            warptrace(1, "RelationshipProxy.getNonAbstractEntities():\n-  Failed to post CRUD commands - " + result.error);
        },
        error: function () {
            warptrace(1, "RelationshipProxy.getNonAbstractEntities():\n-  Failed to post CRUD commands - " + result.error);
        }
    });
}

RelationshipProxy.prototype.useRelationship = function(callback) {
    if (!this.requiresUpdate) {
        warptrace(1, "RelationshipProxy.useRelationship():\n-  Re-using data for " + this.jsonReln.name);
        callback(this);
        return;
    }
    else
        warptrace(1, "RelationshipProxy.useRelationship():\n-  Loading Relationship data for " + this.jsonReln.name);

    if (this.targetIsDocument) {
        var command = {
            domain: $warp.domain,
            command: "AggregationQuery",
            parentRelnName: this.name,
            parentRelnID: this.id,
            targetType: this.targetType,
            parentID: null,
            parentType: this.parentType,
            currentPage: this.currentPage,
            entitiesPerPage: this.entitiesPerPage
        };
        var parentEntity = this.getParentEntity();
        parentEntity.useData(function (parentEntity) {
            if (parentEntity) {
                command.parentID = parentEntity.getValue('_id');
                var reqData = {commandList: []};
                reqData.commandList.push(command);
                $warp.processCRUDcommands(reqData, function (result) {
                    if (result.success) {
                        var entityDocs = result.resultList[0].queryResult;
                        this.queryResultsCount = result.resultList[0].queryResultsCount;
                        this.queryResults = [];
                        this.setSelectedEntity(0);
                        entityDocs.forEach(function (entityDoc) {
                            var cachedProxy = $warp.entityCache_getEntityByID(entityDoc._id);
                            var proxy = cachedProxy ? cachedProxy : new EntityProxy(entityDoc.type, this.targetIsDocument, "editEntity", this);
                            proxy.data = entityDoc;
                            this.queryResults.push(proxy);
                        }.bind(this));
                        warptrace(1, "RelationshipProxy.useRelationship():\n-  Successfull AggregationQuery for " + result.resultList[0].parentRelnName + " (found:" + this.queryResultsCount + ")");
                        this.requiresUpdate = false;
                        callback(this);
                    }
                    else {
                        warptrace(1, "RelationshipProxy.useRelationship():\n-  Warning - could not execute AggregationQuery")
                    }
                }.bind(this));
            }
            else {
                warptrace(1, "RelationshipProxy.useRelationship():\n-  Warning - can not use relationship - parentEntity not found!");
            }
        }.bind(this));
    }
    else {
        // Embedded entity
        warptrace(1, "RelationshipProxy.useRelationship():\n-  embedded entity - " + this.jsonReln.name);
        this.getParentEntity().useData(function (entity) {
            var embeddedReln = null;
            entity.data.embedded.forEach(function(e) {
                if (e.parentRelnId === this.jsonReln.id)
                    embeddedReln = e;
            }.bind(this));
            this.queryResultsCount = embeddedReln.entities.length;
            this.queryResults = [];
            this.setSelectedEntity(0);
            embeddedReln.entities.forEach(function (entityDoc) {
                var cachedProxy = $warp.entityCache_getEntityByID(entityDoc._id);
                var proxy = cachedProxy ? cachedProxy : new EntityProxy(entityDoc.type, this.targetIsDocument, "editEntity", this);
                proxy.data = entityDoc;
                this.queryResults.push(proxy);
            }.bind(this));
            warptrace(1, "RelationshipProxy.useRelationship():\n-  Successfull AggregationQuery for " + this.jsonReln.name + " (found:" + this.queryResultsCount + ")");
            this.requiresUpdate = false;
            callback(this);
        }.bind(this));
    }
}

//
// Class WarpWidget - base class for all WarpJS widgets
//

function WarpWidget(parent, config) {
    if (config === null || typeof config === "undefined")
        throw "Fatal: Can not add child to WarpWidget without 'config'!";
    if (config.localID !== "WarpJS" && (parent === null || typeof parent === "undefined"))
        throw "Fatal: Can not add child to WarpWidget without 'parentEntityProxy'!";
    if (config.localID === null || typeof config.localID === "undefined")
        throw parent.globalID()+": Can not add child with invalid localID!";

    this._parent = parent;
    this._localID = config.localID;
    this._warpJSClient = null;

    this._globalID = (this.hasParent() ? this.getParent().globalID()+"_" : "") + this._localID;
    this.widgetIdx = WarpWidget.prototype.widgetCouter++;
}

WarpWidget.prototype.widgetCouter = 0;
WarpWidget.prototype.getWarpJSClient = function() {
    if (!this._warpJSClient) {
        var parent = this;
        while (parent.getParent()) parent = parent.getParent();
        this._warpJSClient=parent;
    }
    return this._warpJSClient;
}

WarpWidget.prototype.updateViewWithDataFromModel = function() {
    throw "updateViewWithDataFromModel():\n-  This function must be implemented by child classes";
}
WarpWidget.prototype.updateModelWithDataFromView = function() {
    throw "writeViewDataFromModel():\n-  This function must be implemented by child classes";
}

WarpWidget.prototype.getPageView = function() {
    return this.getParent().getPageView();
}

WarpWidget.prototype.getParent = function() {
    return this._parent;
}
WarpWidget.prototype.hasParent = function() {
    return this._parent !== null && typeof this._parent !== "undefined";
}
WarpWidget.prototype.localID = function() {
    return this._localID;
}
WarpWidget.prototype.globalID = function() {
    return this._globalID;
}

//
// Class "WarpJSClient"
//

function WarpJSClient() {
    this.entityCache = [];

    WarpWidget.call(this, null, { localID: "WarpJS" });

    this.pageView = null;
    this.breadcrumb = null;
    this.model = null;
}

WarpJSClient.prototype = Object.create(WarpWidget.prototype);
WarpJSClient.prototype.constructor = WarpJSClient;

var warptracelevel = 2; // 0=ignore
warptrace = function(level, message) {
    if (warptracelevel>=level)
        console.log(message);
}

WarpJSClient.prototype.getPageView = function() {
    return this.pageView;
}

WarpJSClient.prototype.updateViewWithDataFromModel = function() {
    this.breadcrumb.updateViewWithDataFromModel();
    this.pageView.updateViewWithDataFromModel();
}
WarpJSClient.prototype.updateModelWithDataFromView = function() {
    this.breadcrumb.updateModelWithDataFromView();
    this.pageView.updateModelWithDataFromView();
}

WarpJSClient.prototype.addBreadcrumb = function(config) {
    this.breadcrumb = new WarpBreadcrumb(this, config);
    return this.breadcrumb;
}

WarpJSClient.prototype.createViews = function() {
    var container =  $('<div class="container" role="main"></div>');
    var row =        $('<div class="row"></div>');
    var col =        $('<div class="col-sm-12"></div>');

    col.append(this.breadcrumb.createViews());
    col.append(this.pageView.createViews());

    container.append(row);
    row.append(col);

    return container;
}

WarpJSClient.prototype.entityCache_getEntityByID = function(id) {
    this.entityCache.forEach(function (entityProxy) {
        if (entityProxy.data & entityProxy.data._id === id)
            warptrace(1, "WarpJSClient.entityCache_getEntityByID():\n- Found entity in cache: "+id);
            return entityProxy;
    });
    return null;
}

WarpJSClient.prototype.save = function() {
    $warp.pageView.updateModelWithDataFromView();

    warptrace(3, "\n-------------------------\nWarpJSClient.save():\n-------------------------");
    $warp.entityCache.forEach(function(entityProxy) {
        if (entityProxy.data) {
            if (entityProxy.isDocument)
                warptrace(3, "  * Document\n    - Name: " + entityProxy.displayName() + "\n    - isDirty: " + entityProxy.isDirty);
            else
                warptrace(3, "  * Embedded Entity\n    - Child of:" + entityProxy.getDocument().displayName() + "\n    - Name: " + entityProxy.displayName() + "\n    - isDirty: " + entityProxy.isDirty);
        }
    });
    warptrace(3, "\n-------------------------");

    $warp.entityCache.forEach(function(entityProxy) {
        warptrace(1, "\n-------------------------\nWarpJSClient.save():\n-------------------------");
        if (entityProxy.isDocument && entityProxy.isDirty && entityProxy.data) {
            warptrace(1, "  * Saving Document\n    - Name: " + entityProxy.displayName() + "\n    - isDirty: " + entityProxy.isDirty);
            var reqData = {
                // The backend-API only supports update of a single document at the moment - TBD!!!
                commandList: [
                    {
                        command: "Update",
                        domain: $warp.domain,
                        targetType: entityProxy.data.type,
                        entities: [entityProxy.data]
                    }
                ]
            };
            $warp.processCRUDcommands(reqData, function (result) {
                if (result.success) {
                    console.log("Save: OK!");
                }
                else {
                    alert(result.err);
                }
            });
        }
    });
}

function initializeWarpJS (jsonData, config, callback) {
    $warp = new WarpJSClient;
    $warp.initialize (jsonData, config, callback);
}

WarpJSClient.prototype.initialize = function(jsonData, config, callback) {
    // Remember domain for this client:
    $warp.domain = config.domainName;

    // Add a breadcrumb
    this.addBreadcrumb({ localID: "breadcrumb" });

    // Handle URL Arguments: editEntity || addEntity || rootInstance
    var isDocument = true; // RootEntity is always document
    var entity = new EntityProxy(config.entityType, isDocument);
    var oid = this.getURLParam("oid");
    var urlHasArgs = window.location.search.split('?').length !== 1;
    if (!urlHasArgs) {
        entity.mode = "rootInstance";
    } else if (oid) {
        entity.mode = "editEntity";
        entity.oid = oid;
    } else {
        entity.mode = "addNewEntity";
        entity.parentID = this.getURLParam("parentID");
        entity.relnID = this.getURLParam("relnID");
        entity.relnName = this.getURLParam("relnName");
        entity.parentBaseClassName = this.getURLParam("parentBaseClassName");
        entity.parentBaseClassID = this.getURLParam("parentBaseClassID");
        if (!entity.parentID || !entity.relnID || !this.relnName || !this.parentBaseClassName || !this.parentBaseClassID)
            alert ("Invalid URL!");
    }

    // Get page view
    this.model = new WarpModelParser(jsonData);
    var entityDefn = this.model.getEntityByName(config.entityType);
    if (!entityDefn) throw "Can`t find entity:"+config.entityType;
    var defaultView = this.model.getPageView(entityDefn, config.viewName);
    defaultView.entityType = config.entityType;

    // Build WarpViews
    defaultView.localID = "mainPV";
    defaultView.style = "tabs";

    // Create top-most PageView
    this.pageView = new WarpPageView (this, defaultView);
    this.pageView.setEntityProxy(entity);
    this.pageView.isToplevelPageView=true;

    // Prepare remote connection
    $.ajax({
        headers: {
            'Accept': 'application/hal+json'
        },
        success: function (result) {
            $warp.links = result._links;

            // Pre-load data for entities...
            $warp.pageView.initialize(function() {
                // Create HTML views
                var htmlViews = $warp.createViews();
                $("#"+config.htmlElements.rootElem).append(htmlViews);
                warptrace(3, "---------------");
                warptrace(3, htmlViews.html());
                warptrace(3, "---------------");

                // Add HTML Bindings
                $("#"+config.htmlElements.saveButton).on("click", $warp.save);

                // And finally: populate the views...
                $warp.updateViewWithDataFromModel();

                warptrace(1, "---------------");
                warptrace(1, $warp.pageView.toString());
                warptrace(1, "---------------");

                if (callback)
                    callback();
            });
        },
        error: function (result) {
            alert("Initialize WarpJSClient: remote connection failure!");
        }
    });
}

WarpJSClient.prototype.processCRUDcommands = function (commandList, handleResult) {
    //Create JSON Data
    var reqData = JSON.stringify(commandList, null, 2)

    // Post to server
    $.ajax({
        url: $warp.links.crud.href,
        type: 'POST',
        data: reqData,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (result) {
            if (result.success) {
                handleResult (result);
            }
            else {
                warptrace(1, "WarpJSClient.processCRUDcommands():\n-  Failed to post CRUD commands - " + result.error);
            }
        },
        error: function () {
            console.log(1, "WarpJSClient.processCRUDcommands():\n-  Error while posting CRUD commands!");
        }
    });
}

WarpJSClient.prototype.getURLParam = function(argName) {
    var urlSearch = window.location.search;
    var arg = urlSearch.split(argName + "=");
    if (arg.length < 2) {
        return null;
    }
    return arg[1].split("&")[0];
};

//
// Class "WarpModelParser"
//

function WarpModelParser(jsonData) {
    this.model = jsonData;
}

WarpModelParser.prototype.getEntityByName = function(entityType) {
    return this.model.entities.find  (function(entity) {
        return entity.name === entityType;
    });
}
WarpModelParser.prototype.getEntityByID = function(entityID) {
    return this.model.entities.find  (function(entity) {
        return entity.id === entityID;
    });
}
WarpModelParser.prototype.getPropertyByID = function(propertyID) {
    for (idx=0; idx<this.model.entities.length; idx++) {
        var property = this.model.entities[idx].basicProperties.find (function(elem) {
            return elem.id === propertyID;
        });
        if (property) return property;
    }
    return null;
}
WarpModelParser.prototype.getRelnParentByID = function(relnID) {
    for (idx=0; idx<this.model.entities.length; idx++) {
        var reln = this.model.entities[idx].relationships.find (function(elem) {
            return elem.id === relnID;
        });
        if (reln) return this.model.entities[idx];
    }
    return null;
}

WarpModelParser.prototype.getEnumByID = function(enumID) {
    for (idx=0; idx<this.model.entities.length; idx++) {
        var e = this.model.entities[idx].enums.find (function(elem) {
            return elem.id === enumID;
        });
        if (e) return e;
    }
    return null;
}

WarpModelParser.prototype.getRelationshipByID = function(relnID) {
    for (idx=0; idx<this.model.entities.length; idx++) {
        var reln = this.model.entities[idx].relationships.find (function(elem) {
                return elem.id === relnID;
        });
        if (reln) return reln;
    }
    return null;
}

WarpModelParser.prototype.getPageView = function(entity, viewName) {
    return entity.pageViews.find (function(view) {
        return view.name === viewName;
    });
}

WarpModelParser.prototype.getDefaultPageView = function(entity) {
    return entity.pageViews.find (function(view) {
        return view.isDefault;
    });
}

WarpModelParser.prototype.getDefaultTableView = function(entity) {
    return entity.tableViews.find (function(view) {
        return view.isDefault;
    });
}

//
// Class "WarpBreadcrumb"
//

function WarpBreadcrumb(parent, config) {
    WarpWidget.call(this, parent, config);
}

WarpBreadcrumb.prototype = Object.create(WarpWidget.prototype);
WarpBreadcrumb.prototype.constructor = WarpBreadcrumb;

WarpBreadcrumb.prototype.updateViewWithDataFromModel = function() {
    warptrace(3, "WarpBreadcrumb.updateViewWithDataFromModel():\n-  TBD - Update Breadcrumb");
}
WarpBreadcrumb.prototype.updateModelWithDataFromView = function() {
}

WarpBreadcrumb.prototype.createViews = function()
{
    var bc = $(
        '<ol class="breadcrumb">'+
        '   Breadcrumb' +
        '</ol>');

    return bc;
}

//
// Class "WarpPageView"
//

function WarpPageView(parent, config) {
    this.reset(config);
    WarpWidget.call(this, parent, config);
}

WarpPageView.prototype = Object.create(WarpWidget.prototype);
WarpPageView.prototype.constructor = WarpPageView;

WarpPageView.prototype.reset = function (config, entityProxy) {
    if (!config || !config.entityType) throw "PageView must have config and entityType!";
    this.entityType = config.entityType;
    this.config = config;
    this.label = config.label;
    this.style = config.style;
    this.panels = [];
    this._entityProxy = entityProxy;
    this._relnProxies = [];
    this._relnProxyIdx = -1;
    this._childPageViews = [];
    this._childPageViewIdx = -1;
    this._addPanelsRequired = true;
}

// Overwrite defaults:
WarpPageView.prototype.getPageView = function() {
    return this;
}

WarpPageView.prototype.getEntityProxy = function() {
    return this._entityProxy;
}

WarpPageView.prototype.setEntityProxy = function(entity) {
    this._entityProxy = entity;
}

WarpPageView.prototype.initialize = function (callback) {
    if (!this._entityProxy)
        throw "Must set EntityProxy first before initializing PageView!";

    if (this._addPanelsRequired) {
        this._addPanelsRequired = false;
        for (var idx = 0; this.config.panels && idx < this.config.panels.length; idx++) {
            var panel = this.config.panels[idx];
            panel.localID = "panel" + idx;
            this.addPanel(panel);
        }
    }

    if (!this._entityProxy.data) {
        this._entityProxy.useData(function (entityProxy) {
            this.initialize(callback);
        }.bind(this));
    }
    else {
        if (this._relnProxyIdx === -1)
            this._relnProxyIdx = 0;
        if (this._relnProxyIdx < this._relnProxies.length) {
            this._relnProxies[this._relnProxyIdx++].useRelationship(function (relnProxy) {
                // Don`t need to do anything; just ensure the data is loaded
                this.initialize(callback);
            }.bind(this));
        }
        else {
            if (this._childPageViewIdx === -1)
                this._childPageViewIdx = 0;
            if (this._childPageViewIdx < this._childPageViews.length) {
                var childPageView =
                    this._childPageViews[this._childPageViewIdx++];
                var relnProxyForChildPV =
                    this.getEntityProxy().getRelationshipProxy(childPageView.parentRelationshipID);
                if (!relnProxyForChildPV.getProxyForSelectedEntity())
                    console.log("Hmmm?");
                childPageView.setEntityProxy(relnProxyForChildPV.getProxyForSelectedEntity());
                childPageView.initialize(function() {
                    this.initialize(callback);
                }.bind(this));
            }
            else {
                callback();
            }

        }
    }
}

WarpPageView.prototype.toString = function (spacing) {
    if (!spacing) spacing = 1;
    var spaces = "";
    for (var idx = 0; idx<spacing; idx++) spaces += " ";
    var dn = this.getEntityProxy().data ? ": "+this.getEntityProxy().displayName() : "";
    var str = "\n" + spaces + "* PageView ["+this.widgetIdx+", " + this.entityType+"]"+dn;
    this._relnProxies.forEach(function(rp) {
        str += rp.toString(spacing+1);
    });
    this._childPageViews.forEach(function(pv) {
        str += pv.toString(spacing+2);
    });
    return str;
}

WarpPageView.prototype.addChildPageView = function (panelItem, config) {
    var pv = new WarpPageView(panelItem, config);
    pv.parentRelationshipID = panelItem.relationshipID;
    this._childPageViews.push(pv);
    return pv;
}

WarpPageView.prototype.addRelationship = function (relnID) {
    var newReln = this.getEntityProxy().getRelationshipProxy(relnID);
    this._relnProxies.push(newReln);
    return newReln;
}

WarpPageView.prototype.updateViewWithDataFromModel = function() {
    this.panels.forEach(function(panel) { panel.updateViewWithDataFromModel(); });
}
WarpPageView.prototype.updateModelWithDataFromView = function() {
    this.panels.forEach(function(panel) { panel.updateModelWithDataFromView(); });
}

WarpPageView.prototype.addPanel = function(config) {
    var newPanel = new WarpPanel(this, config);
    this.panels.push(newPanel);

    for (var idx=0; config.separatorPanelItems && idx<config.separatorPanelItems.length; idx++) {
        var separatorPanelItem=config.separatorPanelItems[idx];
        separatorPanelItem.localID = "sItem"+idx;
        newPanel.addSeparatorPanelItem(separatorPanelItem);
    }
    for (var idx=0; config.basicPropertyPanelItems && idx<config.basicPropertyPanelItems.length; idx++) {
        var basicPropertyPanelItem=config.basicPropertyPanelItems[idx];
        basicPropertyPanelItem.localID = "bpItem"+idx;
        newPanel.addBasicPropertyPanelItem(basicPropertyPanelItem);
    }
    for (var idx=0; config.enumPanelItems && idx<config.enumPanelItems.length; idx++) {
        var enumPanelItem=config.enumPanelItems[idx];
        enumPanelItem.localID = "enumItem"+idx;
        newPanel.addEnumPanelItem(enumPanelItem);
    }
    for (var idx=0; config.relationshipPanelItems && idx<config.relationshipPanelItems.length; idx++) {
        var relationshipPanelItem=config.relationshipPanelItems[idx];
        relationshipPanelItem.localID = "relnItem"+idx;
        newPanel.addRelationshipPanelItem(relationshipPanelItem);
    }

    return newPanel;
}

WarpPageView.prototype.createViews = function()
{
    var pv = $('<div></div>');
    pv.prop('style', this.isToplevelPageView ? '':'padding: 10px;' );

    if (true) { // TBD: this.style==="tabs") {
        var navTabs = $('<ul class="nav nav-tabs"></ul>');
        this.panels.forEach(function(panel) {
            var tab = $('<li></li>');
            if (panel.position === 0)
                tab.prop('class', 'active');

            var href = $('<a data-toggle="tab"></a>');
            href.prop('href', '#'+panel.globalID());
            href.text(panel.label);

            navTabs.append(tab);
            tab.append(href);
        });

        var tabContent = $('<div class="tab-content"></div>');
        this.panels.forEach(function(panel) {
            tabContent.append(panel.createViews());
        });
        pv.append(navTabs);
        pv.append(tabContent);
    }

    return pv;
}

//
// Class "WarpPanel"
//

function WarpPanel(parent, config) {
    WarpWidget.call(this, parent, config);
    this.position = config.position;
    this.label = config.label;
    this.panelItems = [];
}

WarpPanel.prototype = Object.create(WarpWidget.prototype);
WarpPanel.prototype.constructor = WarpPanel;

WarpPanel.prototype.updateViewWithDataFromModel = function() {
    this.panelItems.forEach(function(panelItem) { panelItem.updateViewWithDataFromModel(); });
}
WarpPanel.prototype.updateModelWithDataFromView = function() {
    this.panelItems.forEach(function(panelItem) { panelItem.updateModelWithDataFromView(); });
}

WarpPanel.prototype.addSeparatorPanelItem = function(config) {
    var pi = new WarpPanelItem(this, "Separator", config);
    this.panelItems.push(pi);
    return pi;
}

WarpPanel.prototype.addBasicPropertyPanelItem = function(config) {
    var pi = new WarpBasicPropertyPanelItem(this, config);
    this.panelItems.push(pi);
    return pi;
}

WarpPanel.prototype.addEnumPanelItem = function(config) {
    var pi = new WarpEnumPanelItem(this, config);
    this.panelItems.push(pi);
    return pi;
}

WarpPanel.prototype.addRelationshipPanelItem = function(config) {
    var pi = null;
    switch (config.style) {
        case 'CSV':
            // Special class to handle Comma Separated Values
            pi = new WarpRPI_CSV(this, config);
            break;
        case 'Carousel':
            // Special class to handle Carousel-Style display (one entity / page)
            pi = new WarpRPI_Carousel(this, config);

            // Carousel needs a a PageView:
            var relnID = config.relationship[0];
            var reln = this.getWarpJSClient().model.getRelationshipByID(relnID);
            var targetEntity = this.getWarpJSClient().model.getEntityByID(reln.targetEntity[0]);

            var pv = null;
            if (config.view) {
                pv = config.view;
            }
            else { // Get default view
                pv = this.getWarpJSClient().model.getDefaultPageView (targetEntity);
            }
            pv.localID = "pv";
            pv.entityType = targetEntity.name;
            pi.childPageView = this.getPageView().addChildPageView(pi, pv);
            break;
        case 'Table':
            // Special class to handle tables
            pi = new WarpRPI_Table(this, config);

            // Table needs a TableView
            var relnID = config.relationship[0];
            var reln = this.getWarpJSClient().model.getRelationshipByID(relnID);
            var targetEntity = this.getWarpJSClient().model.getEntityByID(reln.targetEntity[0]);

            var tv = null;
            if (config.view) {
                tv = config.view;
            }
            else { // Get default view
                tv = this.getWarpJSClient().model.getDefaultTableView (targetEntity);
            }
            pi.tableViewJson = tv;
            break;
        default: throw "Unknown style for RelationshipProxy PanelItem: "+config.style;
    }
    this.panelItems.push(pi);

    return pi;
}

WarpPanel.prototype.getFormItems = function() {
    var fi = [];
    this.panelItems.forEach(function(panelItem) {
        if (panelItem.isFormItem()) fi.push(panelItem);
    });
    return fi;
}

WarpPanel.prototype.getNonFormItems = function() {
    var nfi = [];
    this.panelItems.forEach(function(panelItem) {
        if (!panelItem.isFormItem()) nfi.push(panelItem);
    });
    return nfi;
}

WarpPanel.prototype.createViews = function() {
    if (true) { // TBD: this.getParent().style === "tabs") {
        var tabContent = $('<div></div>');
        tabContent.prop('class', 'tab-pane fade in' + (this.position === 0 ? ' active' : ''));
        tabContent.prop('id', this.globalID());

        if (this.getFormItems().length>0) {
            var form = $('<form class="form-horizontal"></form>');
            this.getFormItems().forEach(function(panelItem) {
                form.append(panelItem.createViews());
            });
            tabContent.append(form);
        }

        if (this.getNonFormItems().length>0) {
            this.getNonFormItems().forEach(function(panelItem){
                tabContent.append(panelItem.createViews());
            });
        }

        return tabContent;
    }
    else throw "Currently no other style supported";
}

//
// Class "WarpPanelItem"
//

function WarpPanelItem(parent, type, config) {
    WarpWidget.call(this, parent, config);
    this.type = type;
    this.position = config.position;
    this.label = config.label;
}

WarpPanelItem.prototype = Object.create(WarpWidget.prototype);
WarpPanelItem.prototype.constructor = WarpPanelItem;

WarpPanelItem.prototype.isFormItem = function() {
    return this.type  === "Enum"
        || (this.type === "BasicProperty" && this.propertyType !== "text")
        || (this.type === "Relationship" && this.style === "csv");
}

WarpPanelItem.prototype.updateViewWithDataFromModel = function() {
    if (this.type !== "Separator") throw "Internal error - function must be overridden";
}
WarpPanelItem.prototype.updateModelWithDataFromView = function() {
    if (this.type !== "Separator") throw "Internal error - function must be overridden";
}

WarpPanelItem.prototype.createViews = function()
{
    var hr = $('<hr>');
    return hr;
}

//
// Class "WarpBasicPropertyPanelItem"
//

function WarpBasicPropertyPanelItem(parent, config) {
    WarpPanelItem.call(this, parent, "BasicProperty", config);
    var propertyID = config.basicProperty[0];
    var property = $warp.model.getPropertyByID(propertyID);
    this.propertyName = property.name;
    this.propertyType = property.propertyType;
    this.example = property.examples;
}

WarpBasicPropertyPanelItem.prototype = Object.create(WarpPanelItem.prototype);
WarpBasicPropertyPanelItem.prototype.constructor = WarpBasicPropertyPanelItem;

WarpBasicPropertyPanelItem.prototype.updateViewWithDataFromModel = function() {
    var ep = this.getPageView().getEntityProxy();
    ep.useData(function (entity) {
        if (entity) {
            var input = $("#" + this.globalID());
            input.val(entity.getValue(this.propertyName));
        }
        else {
            warptrace(2, "WarpBasicPropertyPanelItem.updateViewWithDataFromModel():\n-  Warning - could not get data from model for BasicPropertyPanelItem, ID=" + this.globalID());
        }
    }.bind(this));
}
WarpBasicPropertyPanelItem.prototype.updateModelWithDataFromView = function() {
    this.getPageView().getEntityProxy().useData(function (entity) {
        if (entity.data) {
            var input = $("#" + this.globalID());
            entity.setValue(this.propertyName, input.val());
        }
        else {
            warptrace(1, "WarpBasicPropertyPanelItem.updateModelWithDataFromView():\n-  Warning - could not update " + this.propertyName + "=" + entity[this.propertyName]);
        }
    }.bind(this));
}

WarpBasicPropertyPanelItem.prototype.createViews = function()
{
    if (this.propertyType !== "text") {
        var formGroup = $('<div class="form-group"></div>');

        var label = $('<label></label>');
        label.prop('for', this.globalID());
        label.prop('class', 'col-sm-2 control-label');
        label.text(this.label);

        var inputDiv = $('<div></div>');
        inputDiv.prop('class', 'col-sm-10');

        var input = $('<input></input>');
        input.prop('type', 'text');
        input.prop('class', 'form-control');
        input.prop('id', this.globalID());

        formGroup.append(label);
        formGroup.append(inputDiv);
        inputDiv.append(input);

        return formGroup;
    }
    else { // Text
        var form = $('<form class="form-vertical"></form>');
        var formGroup = $('<div class="form-group"></div>');

        var label = $('<label></label>');
        label.prop('for', this.globalID());
        label.prop('class', 'col-sm-2 control-label');
        label.text(this.label);

        var textDiv = $('<div></div>');
        textDiv.prop('class', 'col-sm-12');

        var input = $('<textarea></textarea>');
        input.prop('class', 'form-control');
        input.prop('id', this.globalID());

        form.append(formGroup);
        formGroup.append(label);
        formGroup.append(textDiv);
        textDiv.append(input);

        return formGroup;
    }
}

//
// Class "WarpEnumPanelItem"
//

function WarpEnumPanelItem(parent, config) {
    WarpPanelItem.call(this, parent, "Enum", config);
    this.propertyName = config.propertyName;
    this.validEnumSelections = config.validEnumSelections;

    var eID = config.enumeration[0];
    var e = this.getWarpJSClient().model.getEnumByID (eID);
    this.literals = e ? e.literals : [];
}

WarpEnumPanelItem.prototype = Object.create(WarpPanelItem.prototype);
WarpEnumPanelItem.prototype.constructor = WarpEnumPanelItem;

WarpEnumPanelItem.prototype.updateViewWithDataFromModel = function() {
    this.getPageView().getEntityProxy().useData(function (entity) {
        if (entity) {
        var select = $("#"+this.globalID());
        // xxx select.val(entity.getValue(this.propertyName));
        }
        else
            warptrace(2, "WarpEnumPanelItem.updateViewWithDataFromModel():\n-  Warning - could not get data from model for EnumPanelItem, ID="+this.globalID());
    }.bind(this));
}
WarpEnumPanelItem.prototype.updateModelWithDataFromView = function() {
    this.getPageView().getEntityProxy().useData(function (entity) {
        var select = $("#"+this.globalID());
        // xxx entity.setValue(this.propertyName, select.val());
        warptrace("WarpEnumPanelItem.updateModelWithDataFromView():\n-  Warning - could not update "+this.propertyName+"="+entity[this.propertyName]);
    }.bind(this));
}

WarpEnumPanelItem.prototype.createViews = function()
{
    var formGroup = $('<div class="form-group"></div>');

    var label = $('<label></label>');
    label.prop('for', this.globalID());
    label.prop('class', 'col-sm-2 control-label');
    label.text(this.label);

    var selectDiv = $('<div></div>');
    selectDiv.prop('class', 'col-sm-10');

    var select = $('<select></select>');
    select.prop('class', 'form-control');
    select.prop('id', this.globalID());

    if (this.literals) {
        this.literals.forEach (function(literal) {
            var option = $('<option></option>');
            option.text (literal.name);
            select.append(option);
        });
    }

    formGroup.append(label);
    formGroup.append(selectDiv);
    selectDiv.append(select);

    return formGroup;
}

//
// Class "WarpRelationshipPanelItem"
//

function WarpRelationshipPanelItem(parent, config) {
    WarpPanelItem.call(this, parent, "Relationship", config);
    this.relationshipID = config.relationship[0];
    this.style=config.style;
    this.view = null;

    this.getPageView().addRelationship(this.relationshipID);
}

WarpRelationshipPanelItem.prototype = Object.create(WarpPanelItem.prototype);
WarpRelationshipPanelItem.prototype.constructor = WarpRelationshipPanelItem;

WarpRelationshipPanelItem.prototype.getRelationshipProxy = function() {
    var pv = this.getPageView();
    var ep = pv.getEntityProxy();
    var rp = ep.getRelationshipProxy(this.relationshipID);
    return rp;
}

//
// Class "WarpRPI_CSV"
//

function WarpRPI_CSV(parent, config) {
    WarpRelationshipPanelItem.call(this, parent, config);
}

WarpRPI_CSV.prototype = Object.create(WarpRelationshipPanelItem.prototype);
WarpRPI_CSV.prototype.constructor = WarpRPI_CSV;

WarpRPI_CSV.prototype.createViews = function() {
    var formGroup = $('<div class="form-group"></div>');

    var label = $('<label></label>');
    label.prop('for', this.globalID());
    label.prop('class', 'col-sm-2 control-label');
    label.text(this.label);

    var csvDiv = $('<div></div>');
    csvDiv.prop('class', 'col-sm-10');

    formGroup.append(label);
    formGroup.append(csvDiv);

    return formGroup;
}

WarpRPI_CSV.prototype.updateViewWithDataFromModel = function() {
    warptrace(2, "WarpRPI_CSV.updateViewWithDataFromModel():\n-  Warning - 'updateViewWithDataFromModel' for 'WarpRPI_CSV' currently not implemented!");
}

WarpRPI_CSV.prototype.updateModelWithDataFromView = function() {
    warptrace(2, "WarpRPI_CSV.updateModelWithDataFromView():\n-  Warning - 'updateModelWithDataFromView' for 'WarpRPI_CSV' currently not implemented!");
}

//
// Class "WarpRPI_Table"
//

function WarpRPI_Table (parent, config) {
    WarpRelationshipPanelItem.call(this, parent, config);
    this.tableViewJson = null;
}

WarpRPI_Table.prototype = Object.create(WarpRelationshipPanelItem.prototype);
WarpRPI_Table.prototype.constructor = WarpRPI_Table;

WarpRPI_Table.prototype.createViews = function() {
    var table = $('<table class="table table-sm table-hover"></table>');
    table.prop('id', this.globalID());
    return table;
}

WarpRPI_Table.prototype.updateViewWithDataFromModel = function() {
    var relnProxy = this.getRelationshipProxy();
    relnProxy.useRelationship (function(relnProxy) {
        // Create header:
        var thead = $('<thead></thead>');
        var tr = $('<tr></tr>');
        this.tableViewJson.tableItems.forEach (function(tableItem){
            var th = $('<th>'+tableItem.label+'</th>');
            tr.append(th);
        });
        thead.append(tr);

        // Create body:
        var body = $('<tbody></tbody>');
        relnProxy.queryResults.forEach(function(entity) {
            // Create new row for each entity:
            tr = $('<tr></tr>');
            this.tableViewJson.tableItems.forEach (function(tableItem){
                var propertyID = tableItem.property[0];
                var property = $warp.model.getPropertyByID (propertyID);
                var td = $('<td>'+entity.getValue(property.name)+'</td>');
                tr.append(td);
            });
            body.append(tr);
        }.bind(this));

        // Putting it together:
        var table = $('#'+this.globalID());
        table.empty();
        table.append(thead);
        table.append(body);
    }.bind(this));
}

WarpRPI_Table.prototype.updateModelWithDataFromView = function() {
}

//
// Class "WarpRPI_Carousel"
//

function WarpRPI_Carousel(parent, config) {
    WarpRelationshipPanelItem.call(this, parent, config);
    this.childPageView = null;
}

WarpRPI_Carousel.prototype = Object.create(WarpRelationshipPanelItem.prototype);
WarpRPI_Carousel.prototype.constructor = WarpRPI_Carousel;

WarpRPI_Carousel.prototype.createViews = function() {
    var panel =         $('<div class="panel panel-success"></div>');
    var panelHeading =  $('<div class="panel-heading"></div>');
    var panelBody =     $('<div class="panel-body"></div>');

    var formInline =        $('<form    class="form-inline"></form>');
    var formGroup =         $('<div     class="form-group"></div>');
    var inputGrp =          $('<div     class="input-group"></div>');
    var inputGrpAddonLft =  $('<div     class="input-group-addon"></div>');
    var inputGrpAddonIdx =  $('<div     class="input-group-addon">IDX</div>');
    var hrefLft =           $('<a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a>');
    var inputGrpSelect =    $('<select  class="form-control"></select>');
    var inputGrpAddonRgt =  $('<div     class="input-group-addon"></div>');
    var hrefRgt =           $('<a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a>');

    var inputGrpAddonAdd =  $('<div     class="input-group-addon"></div>');
    var hrefAdd =           $('<a href="#"><span class="glyphicon glyphicon-plus-sign"></span></a>');
    var inputGrpAddonDel =  $('<div     class="input-group-addon"></div>');
    var hrefDel =           $('<a href="#"><span class="glyphicon glyphicon-minus-sign"></span></a>');

    // Bind event handlers
    hrefLft.click(this.left.bind(this));
    hrefRgt.click(this.right.bind(this));
    hrefAdd.click(this.add.bind(this));
    hrefDel.click(this.del.bind(this));

    // Misc
    formInline.prop('style', 'padding-bottom:10px')
    inputGrpSelect.prop('id', this.globalID() + '_select');
    inputGrpAddonIdx.prop('id', this.globalID() + '_idx');
    inputGrpSelect.change(this.select.bind(this));

    // Create Hierachy
    inputGrpAddonLft.append(hrefLft);
    inputGrpAddonRgt.append(hrefRgt);
    inputGrpAddonAdd.append(hrefAdd);
    inputGrpAddonDel.append(hrefDel);
    inputGrp.append(inputGrpAddonLft);
    inputGrp.append(inputGrpAddonIdx);
    inputGrp.append(inputGrpSelect);
    inputGrp.append(inputGrpAddonRgt);
    inputGrp.append(inputGrpAddonAdd);
    inputGrp.append(inputGrpAddonDel);
    formGroup.append(inputGrp);
    formInline.append(formGroup);
    panelHeading.append(formInline);
    panel.append(panelHeading);
    panel.append(this.childPageView.createViews());

    return panel;
}

WarpRPI_Carousel.prototype.selectEntityAndUpdate = function(selection) {
    this.updateModelWithDataFromView();
    this.getRelationshipProxy().useRelationship(function(relnProxy) {
        relnProxy.selectEntity(selection);
        relnProxy.useRelationship(function (relnProxy) {
            var proxyForSelectedEntity = relnProxy.getProxyForSelectedEntity();
            this.childPageView.reset(this.childPageView.config, proxyForSelectedEntity);
            this.childPageView.initialize(function () {
                this.updateViewWithDataFromModel();
            }.bind(this));
        }.bind(this));
    }.bind(this));
}

WarpRPI_Carousel.prototype.left = function() {
    warptrace(1, "WarpRPI_Carousel.left():\n-  Left-Click for "+this.globalID());
    this.selectEntityAndUpdate ("-1");
}

WarpRPI_Carousel.prototype.right = function() {
    warptrace(1, "WarpRPI_Carousel.right():\n-  Right-Click for " + this.globalID());
    this.selectEntityAndUpdate ("+1");
}
WarpRPI_Carousel.prototype.add = function() {
    warptrace(3, "WarpRPI_Carousel.left():\n-  (+)-Click for "+this.globalID());
}
WarpRPI_Carousel.prototype.del = function() {
    warptrace(3, "WarpRPI_Carousel.left():\n-  (-)-Click for "+this.globalID());
}
WarpRPI_Carousel.prototype.select = function(e) {
    warptrace(3, "WarpRPI_Carousel.select():\n-  New selection for "+this.globalID());
    var idx = parseInt(e.target.value);
    this.selectEntityAndUpdate (idx);
}

WarpRPI_Carousel.prototype.updateViewWithDataFromModel = function() {
    var rp = this.getRelationshipProxy();
    rp.useRelationship(function(relnProxy) {
        var from = 1 + relnProxy.currentPage * relnProxy.entitiesPerPage;
        var to = from + relnProxy.entitiesPerPage - 1;
        var idx = relnProxy.selectedEntityIdx + from;
        var idxStr = idx + "/" + relnProxy.queryResultsCount;

        $('#' + this.globalID() + '_idx').html(idxStr);

        // Update selection list
        var select = $('#'+this.globalID() + '_select');
        select.empty();
        var option = $('<option>Showing matches from ' + from + ' to ' + to + '</option>');
        select.append(option);
        var option = $('<option>---------------------</option>');
        select.append(option);
        relnProxy.queryResults.forEach(function(entity, idx) {
            if (entity && entity.data) {
                option = $('<option>' + entity.displayName() + '</option>');
                option.prop('value', idx);
                select.append(option);
            }
            else
                warptrace(2, "WarpRPI_Carousel.updateViewWithDataFromModel():\n-  Warning - can't access query result!");
        }.bind(this));
        select.val(relnProxy.selectedEntityIdx);

        // Now update the page contained within
        this.childPageView.updateViewWithDataFromModel();
    }.bind(this));

}

WarpRPI_Carousel.prototype.updateModelWithDataFromView = function() {
    if (this.childPageView)
        this.childPageView.updateModelWithDataFromView();
    else
        warptrace(1, "WarpRPI_Carousel.left():\n-  Warning - RelationshipPanelItem without PageView! (ID:"+this.globalID()+")");
}
