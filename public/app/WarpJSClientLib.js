//
// Trace function for debugging
//

var warptracelevel = 1; // 0=ignore
warptrace = function(level, arg1, arg2, arg3, arg4) {
    if (warptracelevel >= level && arg1 && arg2) {
        console.log(arg1 + '():');
        console.log(' - ' + arg2);
        if (arg3) console.log(' - ' + arg3);
        if (arg4) console.log(' - ' + arg4);
    } else if (warptracelevel >= level) {
        console.log(arg1);
    }
}

//
// Class EntityProxy
//

function EntityProxy(entityConfig) {
    this.type = entityConfig.type;
    this.isDocument = entityConfig.isDocument;
    this.mode = entityConfig.mode;

    // Potentially null:
    this.data = entityConfig.data;
    this.parentRelnProxy = entityConfig.parentRelnProxy;

    if (this.isDocument)
        this.isDirty = false;

    switch (this.mode) {
        case "rootInstance":
            break;
        case "editEntity":
            this.oid = entityConfig.oid;
            if (!this.oid || this.oid.length === 0)
                throw "Can't create EntityProxy in mode 'editEntity' without valid 'oid'!";
            break;
        case "addNewEntity":
            this.parentID = entityConfig.parentID;
            this.relnID = entityConfig.relnID;
            this.relnName = entityConfig.relnName;
            this.parentBaseClassName = entityConfig.parentBaseClassName;
            this.parentBaseClassID = entityConfig.parentBaseClassID;
            break;
        default:
            throw "Invalid mode: " + this.mode;
    }

    this.relationships = {};
    this.history = [];

    $warp.entityCache_add (this);
}

EntityProxy.prototype.getParentRelationship = function () {
    return this.parentRelnProxy;
}

EntityProxy.prototype.getParentEntity = function () {
    return this.getParentRelationship().getParentEntity();
}

EntityProxy.prototype.getDocumentProxy = function() {
    if (this.isDocument)
        return this;
    else
        return this.getParentEntity().getDocumentProxy();
}

EntityProxy.prototype.addRelationshipProxy = function(relnProxy) {
    this.relationships[relnProxy.id] = relnProxy;
}

EntityProxy.prototype.getRelationshipProxy = function(relnID) {
    if (this.relationships[relnID])
        return this.relationships[relnID];
    // Else, create new proxy:
    var newRP = null;
    var jsonReln = $warp.model.getRelationshipByID(relnID);
    if (jsonReln.isAggregation) {
        newRP = new AggregationProxy(jsonReln, this);
    }
    else {
        newRP = new AssociationProxy(jsonReln, this);
    }
    this.relationships[relnID] = newRP;
    return newRP;
}

EntityProxy.prototype.useData = function(callback) {
    if (this.data) {
        callback(this);
        return;
    }

    switch (this.mode) {
        case "rootInstance":
            this.getDataViaRootInstance(
                function(data) {
                    if (data) {
                        this.data = data;
                        callback(this);
                    }
                    else
                        callback(null);
                }.bind(this)
            );
            break;
        case "editEntity":
            if (this.oid) {
                this.getDataViaOID(
                    function(result) {
                        if (result) {
                            this.data = result.matchingEntity;
                            this.breadcrumb = result.breadcrumb;
                            callback(this);
                        }
                        else
                            callback(null);
                    }.bind(this));
                break;
            }
            else
                throw "EntityProxy in mode 'editEntity' must have oid!";
            break;
        case "addNewEntity":
            throw "TBD!";
            break;
        default:
            throw "Invalid mode for entity: '" + this.mode + "'";
    }
}

EntityProxy.prototype.getValue = function(attrName) {
    if (!this.data || this.data[attrName] === null) {
        throw "EntityProxy.getValue(): ERROR - Can not access value '" + attrName + "'";
    }
    warptrace(2, "EntityProxy.getValue", "Getting value for "+attrName+": " + this.data[attrName])
    return this.data[attrName];
}

EntityProxy.prototype.setValue = function(attrName, val) {
    if (!this.data || !this.data[attrName])
        throw "EntityProxy.setValue(): ERROR - Can not set value '" + attrName + "'";
    if (this.data[attrName] !== val) {
        this.data[attrName] = val;
        this.history.push({ date: new Date(), attribute: attrName, newVal: val });
        this.isDirty = true;
        this.getDocumentProxy().isDirty = true;
        warptrace(1, "EntityProxy.setValue():");
        warptrace(1,
            "  * Document\n    - Name: " + this.displayName() + "\n    - isDirty: " + this.isDirty+
            "\n    - Changes: " + this.historyToString());
    }
}

EntityProxy.prototype.historyToString = function() {
    var h = "";
    this.history.forEach(function(entry) {
        h += "[" + entry.attribute + "=" + entry.newVal + "]";
    });
    return h;
}

EntityProxy.prototype.displayName = function() {
    if (!this.data)
        return this.type + ": No data available";
    if (this.data.path && warptracelevel > 1)
        return this.data.path;
    if (this.data.Name)
        return this.data.Name;
    return this.type + "[" + this.data._id + "]";
}

EntityProxy.prototype.getDataViaOID = function(callback) {
    if (this.data) {
        callback(this);
        return;
    }
    var reqData = {
        commandList: [
            {
                command: "FindByID",
                domain: $warp.domain,
                targetType: this.type,
                targetID: this.oid
            }
        ]
    };
    $warp.processCRUDcommands(reqData, function (result) {
        if (result.success) {
            if (!result.resultList || result.resultList.length != 1) {
                alert("Could not find entity!");
                handleResult(null);
                return;
            }
            if (result.resultList[0].error) {
                alert(result.resultList[0].status);
                handleResult(null);
                return;
            }
            var result = result.resultList[0];
            callback (result);
        }
        else {
            alert(result.err);
        }
    }.bind(this));
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
    this.targetEntityDefinition = $warp.model.getEntityByID(jsonReln.targetEntity[0]);
    this.targetType = this.targetEntityDefinition.name;
    this.targetIsDocument = this.targetEntityDefinition.entityType === "Document";
    this.parentType = $warp.model.getRelnParentByID(jsonReln.id).name;

    this.requiresUpdate = true;
    this.currentPage = 0;
    this.entitiesPerPage = 5;
    this.maxNumberOfPages = 5;
    this.selectedEntityIdx = -1;
    this.filter = null;

    this._queryResults = [];
    this._queryResultsCount = -1;

    warptrace(2, "RelationshipProxy():\n-  New proxy for "+this.jsonReln.name);
}

RelationshipProxy.prototype.noOfResultsOnCurrentPage = function () {
    if (this.requiresUpdate)
        throw "noOfResultsOnCurrentPage() called on invalid RelationshipProxy!";
    return this._queryResults.length;
}

RelationshipProxy.prototype.noOfTotalQueryResults = function () {
    if (this.requiresUpdate)
        throw "noOfTotalQueryResults() called on invalid RelationshipProxy!";
    return this._queryResultsCount;
}

RelationshipProxy.prototype.queryResult = function (idx) {
    if (this.requiresUpdate)
        throw "queryResult() called on invalid RelationshipProxy!";
    if (idx <0 || idx >= this.noOfTotalQueryResults())
        throw "queryResult() called with invalid index: "+idx;
    return this._queryResults[idx];
}
RelationshipProxy.prototype.allQueryResults = function () {
    if (this.requiresUpdate)
        throw "allQueryResults() called on invalid RelationshipProxy!";
    return this._queryResults;
}

RelationshipProxy.prototype.toString = function (spacing) {
    var spaces = "";
    var str = "";
    for (var idx = 0; idx<spacing; idx++) spaces += " ";
    if (this.requiresUpdate)
        str = "\n" + spaces + " - RelnProxy [" + this.name + "/" + this.id + "]: INVALID!";
    else
        str = "\n" + spaces + " - RelnProxy [" + this.name + "/" + this.id + "]: len=" + this.noOfResultsOnCurrentPage() + ", idx=" + this.selectedEntityIdx;
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

RelationshipProxy.prototype.ensureSelectedEntityIdxIsValid = function () {
    if (this.selectedEntityIdx < 0 || this.selectedEntityIdx >= this.noOfResultsOnCurrentPage())
        this.selectedEntityIdx = 0;
}

RelationshipProxy.prototype.setSelectedEntity = function (idx) {
    if (idx<0 || idx>this.noOfResultsOnCurrentPage())
        throw "RelationshipProxy.setSelectedEntity() - Selection out of bounds: " + selection;
    this.selectedEntityIdx = idx;
}

RelationshipProxy.prototype.incrementEntitySelection = function () {
    var absolutePos = this.currentPage * this.entitiesPerPage + this.selectedEntityIdx;
    if (absolutePos === this.noOfTotalQueryResults() - 1) {
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
        if (this.currentPage > this.noOfTotalQueryResults() / this.entitiesPerPage)
            this.currentPage = 0;
    }
    else throw "RelationshipProxy.selectEntity(): Internal error - case not covered!"
}

RelationshipProxy.prototype.decrementEntitySelection = function () {
    var absolutePos = this.currentPage * this.entitiesPerPage + this.selectedEntityIdx;
    if (absolutePos === 0) {
        // We have reached the beginning, continue at the end
        if (this.noOfTotalQueryResults() < this.entitiesPerPage) {
            this.currentPage = 0;
            this.selectedEntityIdx = this.noOfTotalQueryResults() - 1;
        }
        else {
            this.currentPage = Math.round(this.noOfTotalQueryResults() / this.entitiesPerPage) - 1;
            this.selectedEntityIdx = this.noOfTotalQueryResults() - this.currentPage * this.entitiesPerPage - 1;
            this.requiresUpdate = true;
        }
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

RelationshipProxy.prototype.incrementSelectedPage = function (selection) {
    var totalPages = Math.round(this.noOfTotalQueryResults() / this.entitiesPerPage);
    if (totalPages === 1) return;
    this.requiresUpdate = true;
    if (this.currentPage < totalPages - 1) {
        this.currentPage++
    }
    else {
        this.currentPage = 0;
    }
}

RelationshipProxy.prototype.decrementSelectedPage = function (selection) {
    var totalPages = Math.round(this.noOfTotalQueryResults() / this.entitiesPerPage);
    if (totalPages === 1) return;
    this.requiresUpdate = true;
    if (this.currentPage === 0) {
        this.currentPage = totalPages - 1;
    }
    else {
        this.currentPage--;
    }
}

RelationshipProxy.prototype.getProxyForSelectedEntity = function () {
    if (this.queryResult(this.selectedEntityIdx))
        return this.queryResult(this.selectedEntityIdx);
    warptrace(1, "RelationshipProxy.getProxyForSelectedEntity():\n- Warning: Can´t get Proxy for selected entity!");
    return null;
}

//
// Class "AggregationProxy"
//

function AggregationProxy(jsonReln, parentEntityProxy) {
    RelationshipProxy.call(this, jsonReln, parentEntityProxy);
}

AggregationProxy.prototype = Object.create(RelationshipProxy.prototype);
AggregationProxy.prototype.constructor = AggregationProxy;

AggregationProxy.prototype.useRelationship = function(callback) {
    if (!this.requiresUpdate) {
        warptrace(2, "AggregationProxy.useRelationship", "Re-using data for " + this.jsonReln.name);
        callback(this);
        return;
    }
    else
        warptrace(2, "AggregationProxy.useRelationship", "Loading Relationship data for " + this.jsonReln.name);

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
                        this._queryResultsCount = result.resultList[0].noOfTotalQueryResults;
                        this._queryResults = [];
                        entityDocs.forEach(function (entityDoc) {
                            var entityConfig = {
                                type: entityDoc.type,
                                isDocument: this.targetIsDocument,
                                mode: "editEntity",
                                oid: entityDoc._id,
                                data: entityDoc,
                                parentRelnProxy: this,
                            }
                            var proxy = $warp.entityCache_findOrAddNewEntityProxy(entityConfig);
                            this._queryResults.push(proxy);
                        }.bind(this));
                        this.requiresUpdate = false;
                        this.ensureSelectedEntityIdxIsValid();
                        warptrace(1, "AggregationProxy.useRelationship", "Document: AggregationQuery for " + result.resultList[0].parentRelnName + " (found:" + this.noOfTotalQueryResults() + ")");
                        callback(this);
                    }
                    else {
                        warptrace(1, "AggregationProxy.useRelationship():\n-  Warning - could not execute AggregationQuery")
                    }
                }.bind(this));
            }
            else {
                warptrace(1, "AggregationProxy.useRelationship():\n-  Warning - can not use relationship - parentEntity not found!");
            }
        }.bind(this));
    }
    else {
        // Embedded entity
        this.getParentEntity().useData(function (entity) {
            var embeddedReln = null;
            entity.data.embedded.forEach(function(e) {
                if (e.parentRelnID === this.jsonReln.id)
                    embeddedReln = e;
            }.bind(this));
            this._queryResultsCount = embeddedReln.entities.length;
            this._queryResults = [];
            this.requiresUpdate = false;
            embeddedReln.entities.forEach(function (entityDoc) {
                var entityConfig = {
                    type: entityDoc.type,
                    isDocument: this.targetIsDocument,
                    mode: "editEntity",
                    oid: entityDoc._id,
                    data: entityDoc,
                    parentRelnProxy: this,
                }
                var proxy = $warp.entityCache_findOrAddNewEntityProxy(entityConfig);
                this._queryResults.push(proxy);
            }.bind(this));
            this.ensureSelectedEntityIdxIsValid();
            var desc = entity.path ? entity.path : entity.displayName();
            warptrace(1, "AggregationProxy.useRelationship", "Embedded Entity: AggregationQuery for " + this.jsonReln.name + " (found:" + this.noOfTotalQueryResults() + ")");
            callback(this);
        }.bind(this));
    }
}

//
// Class "AssociationProxy"
//

function AssociationProxy(jsonReln, parentEntityProxy) {
    RelationshipProxy.call(this, jsonReln, parentEntityProxy);
    this._assocTargetsProxy = new AssociationTargetsProxy(jsonReln, parentEntityProxy);
}

AssociationProxy.prototype = Object.create(RelationshipProxy.prototype);
AssociationProxy.prototype.constructor = AssociationProxy;

AssociationProxy.prototype.getAssocTargetsProxy = function() {
    return this._assocTargetsProxy;
}

AssociationProxy.prototype.noOfTotalQueryResults = function () {
    return this.getAssocs().data.length;
}

AssociationProxy.prototype.useRelationship = function(callback) {
    if (!this.requiresUpdate) {
        callback(this);
        return;
    }

    this.parentEntityProxy.useData(function(sourceProxy) {
        var assocs = this.getAssocs ();
        this._queryResults = [];
        for (var idx = 0; idx < assocs.data.length; idx++) {
            var target = assocs.data[idx];
            entityConfig = {
                type: target.type,
                isDocument: true,
                mode: "editEntity",
                oid: target._id,
                parentRelnProxy: this
            }
            var proxy = $warp.entityCache_findOrAddNewEntityProxy(entityConfig);
            this._queryResults.push(proxy);
        }
        this.requiresUpdate = false;
        callback(this);
    }.bind(this));
}

AssociationProxy.prototype.addToAssocTargets = function(id, targetType, desc) {
    if (!this.parentEntityProxy.data)
        throw "Can not access data for " + this.parentEntityProxy.toString();

    var assocs = this.getAssocs();
    assocs.data.push(
        {
            "_id":id,
            "type":targetType,
            "desc": desc
        });
    this.parentEntityProxy.isDirty = true;
    this.requiresUpdate = true;
}

AssociationProxy.prototype.getAssocs = function() {
    if (!this.parentEntityProxy.data)
        throw "Can not access data for " + this.parentEntityProxy.toString();
    if (!this.parentEntityProxy.data.associations)
        this.parentEntityProxy.data.associations = [];

    var allAssocs = this.parentEntityProxy.data.associations;
    var result = null;
    allAssocs.forEach(function(assocObj) {
        if (assocObj.relnID === this.id)
            result = assocObj;
    }.bind(this));
    if (!result) {
        result = {
            relnID: this.id,
            relnName: this.name,
            data: []
        };
        this.parentEntityProxy.data.associations.push(result);
        this.parentEntityProxy.isDirty = true;
        this.requiresUpdate = true;
    }
    return result;
}

AssociationProxy.prototype.getAssocDataByTargetID = function(id) {
    var result = null;
    var assocArray = this.getAssocs().data;
    assocArray.forEach(function(assoc) {
        if (assoc._id === id) {
            result = assoc;
        }
    });
    if (result)
        return result;
    else
        throw "Could not find association target with id=" + id + " in " + this.toString();
}

AssociationProxy.prototype.updateAssocData = function(id, desc) {
    var assocArray = this.getAssocs().data;

    var ok = false;
    assocArray.forEach(function(assoc) {
        if (assoc._id === id) {
            ok = true;
            assoc.desc = desc;
        }
    });
    if (!ok)
        throw "Could not find association target with id=" + id + " in " + this.toString();

    this.parentEntityProxy.isDirty = true;
    this.requiresUpdate = true;
}

AssociationProxy.prototype.removeFromAssocTargets = function(id) {
    if (this.requiresUpdate)
        throw "Invalid use of 'removeFromAssocTargets()'";

    // Create new array without element 'id'
    var assocArray = this.getAssocs().data;
    var assocArrayNew = [];
    for (var idx in assocArray) {
        if (assocArray[idx]._id !== id)
            assocArrayNew.push(assocArray[idx]);
    }

    // Find assocObject and replace current assocArray
    var allAssocs = this.parentEntityProxy.data.associations;
    var ok = false;
    allAssocs.forEach(function(assocObj) {
        if (assocObj.relnID === this.id) {
            ok = true;
            assocObj.data = assocArrayNew;
        }
    }.bind(this));
    if (!ok)
        throw "Could not remove association from target list!";

    this.requiresUpdate = true;
}

//
// Class "AssociationTargetsProxy"
//

function AssociationTargetsProxy(jsonReln, parentEntityProxy) {
    RelationshipProxy.call(this, jsonReln, parentEntityProxy);
}

AssociationTargetsProxy.prototype = Object.create(RelationshipProxy.prototype);
AssociationTargetsProxy.prototype.constructor = AssociationTargetsProxy;

AssociationTargetsProxy.prototype.useRelationship = function(callback) {
    if (!this.requiresUpdate) {
        warptrace(2, "AssociationTargetsProxy.useRelationship", "Re-using data for " + this.jsonReln.name);
        callback(this);
        return;
    }
    else
        warptrace(2, "AssociationTargetsProxy.useRelationship", "Loading Relationship data for " + this.jsonReln.name);

    if (this.targetIsDocument) {
        var command = {
            queryID: 1,
            domain: $warp.domain,
            command: "FindAssocTargetOptions",
            sourceID: this.id,
            sourceType: this.parentType,
            targetType: this.targetType,
            sourceRelnName: this.name,
            sourceRelnID: this.id,
            currentPage: this.currentPage,
            entitiesPerPage: this.entitiesPerPage,
            filter: this.filter
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
                        this._queryResultsCount = result.resultList[0].noOfTotalQueryResults;
                        this._queryResults = [];
                        entityDocs.forEach(function (entityDoc) {
                            var entityConfig = {
                                type: entityDoc.type,
                                isDocument: this.targetIsDocument,
                                mode: "editEntity",
                                oid: entityDoc._id,
                                data: entityDoc,
                                parentRelnProxy: this,
                            }
                            var proxy = $warp.entityCache_findOrAddNewEntityProxy(entityConfig);
                            this._queryResults.push(proxy);
                        }.bind(this));
                        this.requiresUpdate = false;
                        this.ensureSelectedEntityIdxIsValid();
                        warptrace(1, "AssociationTargetsProxy.useRelationship", "Document: AssociationQuery for " + result.resultList[0].sourceRelnName + " (found:" + this.noOfTotalQueryResults() + ")");
                        callback(this);
                    }
                    else {
                        warptrace(1, "AssociationTargetsProxy.useRelationship():\n-  Warning - could not execute AssociationQuery")
                    }
                }.bind(this));
            }
            else {
                warptrace(1, "AssociationTargetsProxy.useRelationship():\n-  Warning - can not use relationship - parentEntity not found!");
            }
        }.bind(this));
    }
    else {
        // Embedded entity
        throw "Embedded entities as association targets currently not supported!"
    }
}

//
// Class WarpWidget - base class for all WarpJS widgets
//

var widgetCounter = 0;

function WarpWidget(parent, config) {
    if (config === null || typeof config === "undefined")
        throw "Fatal: Can not add child to WarpWidget without 'config'!";
    if (config.localID !== "WarpJS" && (parent === null || typeof parent === "undefined"))
        throw "Fatal: Can not add child to WarpWidget without 'parentEntityProxy'!";
    if (config.localID === null || typeof config.localID === "undefined")
        throw parent.globalID()+": Can not add child with invalid localID!";

    this._parent = parent;
    this._warpJSClient = null;

    this._wID = widgetCounter++;

    this._localID = config.localID;
    this._globalID = (this.hasParent() ? this.getParent().globalID()+"_" : "") + this._localID;
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

WarpJSClient.prototype.getPageView = function() {
    return this.pageView;
}

WarpJSClient.prototype.entityCache_getEntityByID = function(id) {
    this.entityCache.forEach(function (entityProxy) {
        if (entityProxy.data && entityProxy.data._id === id)
            warptrace(1, "WarpJSClient.entityCache_getEntityByID", "Found entity in cache: "+id);
        return entityProxy;
    });
    return null;
}

WarpJSClient.prototype.entityCache_findOrAddNewEntityProxy = function(entityConfig) {
    if (entityConfig.oid) {
        var p = $warp.entityCache_getEntityByID(entityConfig.oid);
        if (p) return p;
    }
    if (entityConfig.data) {
        var p = $warp.entityCache_getEntityByID(entityConfig.data._id);
        if (p) return p;
    }
    return new EntityProxy(entityConfig);
}

WarpJSClient.prototype.entityCache_add = function(ep) {
    if (ep.data && this.entityCache_getEntityByID(ep.data._id))
        throw "Entity Cache: Can not add proxy with same ID twice (" + ep.toString() + ")";
    this.entityCache.push(ep);
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

WarpJSClient.prototype.progressBarOn = function(percent) {
    if (!$warp.progressBarModal) {
        var modal = $('<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;"></div>');
        var modalDialog = $('<div class="modal-dialog modal-m"></div>');
        var modalContent = $('<div class="modal-content"></div>');
        var modalHeader = $('<div class="modal-header"><h3 style="margin:0;">Loading</h3></div>');
        var modalBody = $('<div class="modal-body"></div>');
        var progress = $('<div class="progress progress-striped active" style="margin-bottom:0;"></div>');
        var progressBar = $('<div class="progress-bar" aria-valuemin="0" aria-valuemax="100"></div>');

        modal.append(modalDialog);
        modalDialog.append(modalContent);
        modalContent.append(modalHeader);
        modalContent.append(modalBody);
        modalBody.append(progress);
        progress.append(progressBar);

        $warp.progressBar = progressBar;
        $warp.progressBarModal = modal;
    }
    $warp.progressBar.prop('aria-valuenow', "" + percent);
    $warp.progressBar.prop('style', "width:" + percent + "%");
    $warp.progressBarModal.modal('show');
}

WarpJSClient.prototype.progressBarOff = function() {
    $warp.progressBarModal.modal('hide');
}

WarpJSClient.prototype.createViews = function() {
    var container = null;
    if ($("#" + this.globalID()).length)  {
        container = $("#" + this.globalID());
    }
    else {
        container =  $('<div class="container" role="main"></div>');
        container.prop('id', this.globalID());
    }
    container.empty();

    var row =        $('<div class="row"></div>');
    var col =        $('<div class="col-sm-12"></div>');

    col.append(this.breadcrumb.createViews());
    col.append(this.pageView.createViews());

    container.append(row);
    row.append(col);

    return container;
}

WarpJSClient.prototype.save = function() {
    warptrace(1, "--------------- View Hierarchy ---------------");
    warptrace(1, $warp.pageView.toString());
    warptrace(1, "--------------- -------------- ---------------");

    $warp.pageView.updateModelWithDataFromView();

    warptrace(1, "--------------- View Hierarchy ---------------");
    warptrace(1, $warp.pageView.toString());
    warptrace(1, "--------------- -------------- ---------------");

    warptrace(1, ">>> WarpJSClient.save()");
    $warp.entityCache.forEach(function(entityProxy) {
        if (entityProxy.isDirty) {
            if (!entityProxy.data) throw "Can not save 'dirty' entity without data!";
            if (entityProxy.isDocument) {
                warptrace(
                    1, "* Document\n    - Name: " + entityProxy.displayName() + "\n    - isDirty: " + entityProxy.isDirty +
                    "\n    - Changes: " + entityProxy.historyToString());
                warptrace(1, "JSON:");
                var jsonData = JSON.stringify(entityProxy.data, null, 2);
                warptrace(1, jsonData);
            }
            else {
                warptrace(1, "* Embedded Entity\n    - Child of:" + entityProxy.getDocumentProxy().displayName() + "\n    - Name: " + entityProxy.displayName() + "\n    - isDirty: " + entityProxy.isDirty);
                warptrace(1, "- Changes: " + entityProxy.historyToString());
            }
        }
    });
    warptrace(1, "<<< WarpJSClient.save()");

    $warp.entityCache.forEach(function(entityProxy) {
        if (entityProxy.isDocument && entityProxy.isDirty) {
            if (!entityProxy.data) throw "Can not save 'dirty' entity without data!";
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
                    this.isDirty = false;
                    warptrace(1, "WarpJSClient.save():\n - Successfully saved " + this.displayName());
                }
                else {
                    alert(result.err);
                }
            }.bind(entityProxy));
        }
    });
}

function initializeWarpJS (config, callback) {
    // Create client + show load progress
    $warp = new WarpJSClient;
    $warp.progressBarOn(25);

    // Prepare remote connection
    $.ajax({
        headers: {
            'Accept': 'application/hal+json'
        },
        success: function (result) {
            $warp.links = result._links;

            $warp.progressBarOn(50);

            $.ajax({
                url: $warp.links.domain.href,
                type: 'GET',
                dataType: "json",
                success: function (result) {
                    if (result.success) {
                        $warp.progressBarOn(75);
                        $warp.initialize(result.domain, config, callback);
                    }
                    else {
                        warptrace(1, "initializeWarpJS", "Failed to get domain data - " + result.error);
                    }
                },
                error: function () {
                    warptrace(1, "initializeWarpJS", "Failed to get domain data - " + result.error);
                }
            });

        },
        error: function (result) {
            alert("Initialize WarpJSClient: remote connection failure!");
        }
    });
}

WarpJSClient.prototype.initialize = function (jsonData, pageConfig, callback) {
    // Get Type + Domain
    $warp.domain = this.getDomainFromURL();
    pageConfig.entityType = this.getEntityTypeFromURL();

    var entityConfig = {
        type: pageConfig.entityType,
        isDocument: true // Toplevel Entity on a page is always a document
    }

    // Handle URL Arguments: editEntity || addEntity || rootInstance
    var oid = this.getURLParam("oid");
    var urlHasArgs = window.location.search.split('?').length !== 1;
    if (!urlHasArgs) {
        entityConfig.mode = "rootInstance";
    } else if (oid) {
        entityConfig.mode = "editEntity";
        entityConfig.oid = oid;
    } else {
        entityConfig.mode = "addNewEntity";
        entityConfig.parentID = this.getURLParam("parentID");
        entityConfig.relnID = this.getURLParam("relnID");
        entityConfig.relnName = this.getURLParam("relnName");
        entityConfig.parentBaseClassName = this.getURLParam("parentBaseClassName");
        entityConfig.parentBaseClassID = this.getURLParam("parentBaseClassID");
        if (!entityConfig.parentID || !entityConfig.relnID || !entityConfig.relnName || !entityConfig.parentBaseClassName || !entityConfig.parentBaseClassID)
            alert("Invalid URL!");
    }

    // Create toplevel EntityProxy
    var entity = new EntityProxy(entityConfig);

    // Get page view
    this.model = new WarpModelParser(jsonData);
    var entityDefn = this.model.getEntityByName(pageConfig.entityType);
    if (!entityDefn) {
        alert("Invalid entity type in URL: " + pageConfig.entityType);
        throw "Can`t find entity:" + pageConfig.entityType;
    }
    var defaultView = this.model.getPageView(entityDefn, pageConfig.viewName);
    defaultView.entityType = pageConfig.entityType;

    // Build WarpViews
    defaultView.localID = "mainPV";
    defaultView.style = "tabs";

    // Create top-most PageView
    this.pageView = new WarpPageView(this, defaultView);
    this.pageView.setEntityProxy(entity);
    this.pageView.isToplevelPageView = true;

    // Add a breadcrumb
    this.addBreadcrumb({localID: "breadcrumb"});

    // Pre-load data for entities...
    $warp.pageView.initialize(function () {
        // Create HTML views
        var htmlViews = $warp.createViews();
        $("#" + pageConfig.htmlElements.rootElem).append(htmlViews);
        warptrace(3, "---------------");
        warptrace(3, htmlViews.html());
        warptrace(3, "---------------");

        // Add HTML Bindings
        $("#" + pageConfig.htmlElements.saveButton).on("click", $warp.save);

        // And finally: populate the views...
        $warp.updateViewWithDataFromModel();

        warptrace(1, "--------------- View Hierarchy ---------------");
        warptrace(1, $warp.pageView.toString());
        warptrace(1, "--------------- -------------- ---------------");

        $warp.progressBarOn(100);
        $warp.progressBarOff();

        if (callback)
            callback();
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
            warptrace(1, "WarpJSClient.processCRUDcommands():\n-  Error while posting CRUD commands!");
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
WarpJSClient.prototype.getDomainFromURL = function() {
    var path = window.location.pathname;
    elems = path.split("/");
    return elems.length > 2 ? elems[elems.length-2] : null;
};
WarpJSClient.prototype.getEntityTypeFromURL = function() {
    var path = window.location.pathname;
    elems = path.split("/");
    return elems.length > 1 ? elems[elems.length-1] : null;
};

//
// Class "WarpBreadcrumb"
//

function WarpBreadcrumb(parent, config) {
    WarpWidget.call(this, parent, config);
}

WarpBreadcrumb.prototype = Object.create(WarpWidget.prototype);
WarpBreadcrumb.prototype.constructor = WarpBreadcrumb;

WarpBreadcrumb.prototype.updateViewWithDataFromModel = function() {
    var ep = $warp.pageView.getEntityProxy();
    ep.useData(function (ep) {
        var bc = $("#" + this.globalID()).empty();
        if (ep.data.isRootInstance) {
            var href = $warp.links.domain.href + '/' + ep.data.type;
            var li = "<li class='breadcrumb-item'><a href='" + href + "'>" + ep.data.type + "</a></li>"
            bc.append(li);
        }
        else {
            var breadcrumb = ep.breadcrumb;
            for (var idx = 0; idx < breadcrumb.length; idx++) {
                var item = breadcrumb[idx];
                var href = $warp.links.domain.href + '/' + item.type;
                var li = "<li class='breadcrumb-item'><a href='" + href + "?oid=" + item._id + "' data-toggle='tooltip' title='" + item.type + "'>" + item.shortHand + "</a></li>"
                bc.append(li);
            }
        }
    }.bind(this));
}
WarpBreadcrumb.prototype.updateModelWithDataFromView = function() {
}

WarpBreadcrumb.prototype.createViews = function()
{
    var bc = $(
        '<ol class="breadcrumb">' +
        '   Breadcrumb' +
        '</ol>');
    bc.prop('id', this.globalID());

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
    this._addPanelsRequired = true;

    this._entityProxy = entityProxy;
    this._relnProxies = [];
    this._relnProxyIdx = -1;

    this._childPageViews = [];
    this._childPageViewIdx = -1;
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

    // Create Panels
    if (this._addPanelsRequired) {
        this._addPanelsRequired = false;
        for (var idx = 0; this.config.panels && idx < this.config.panels.length; idx++) {
            var panel = this.config.panels[idx];
            panel.localID = "panel" + idx;
            this.addPanel(panel);
        }
    }

    // Load data for own Entity Proxy
    if (!this._entityProxy.data) {
        this._entityProxy.useData(function (entityProxy) {
            warptrace (1, "WarpPageView.initialize", "Loaded data for: "+this.getEntityProxy().displayName());
            this.initialize(callback);
        }.bind(this));
    }
    else {
        // Load data for all relationships used by this PageView
        if (this._relnProxyIdx === -1)
            this._relnProxyIdx = 0;
        if (this._relnProxyIdx < this._relnProxies.length) {
            this._relnProxies[this._relnProxyIdx++].useRelationship(function (relnProxy) {
                // Don`t need to do anything; just ensure the data is loaded
                warptrace (1, "WarpPageView.initialize", "Loading relationship data for: "+this.getEntityProxy().displayName() + ', ' + relnProxy.name);
                this.initialize(callback);
            }.bind(this));
        }
        else {
            // Initialize child PageViews
            if (this._childPageViewIdx === -1)
                this._childPageViewIdx = 0;
            if (this._childPageViewIdx < this._childPageViews.length) {
                var childPageView =
                    this._childPageViews[this._childPageViewIdx++];
                var relnProxyForChildPV =
                    this.getEntityProxy().getRelationshipProxy(childPageView.parentRelationshipID);
                if (relnProxyForChildPV.noOfResultsOnCurrentPage() === 0) {
                    warptrace(1, "WarpPageView.initialize():\n- No elements found in relationship '"+relnProxyForChildPV.name + "'");
                    this.initialize(callback);
                }
                else {
                    childPageView.setEntityProxy(relnProxyForChildPV.getProxyForSelectedEntity());
                    childPageView.initialize(function () {
                        this.initialize(callback);
                    }.bind(this));
                }
            }
            else {
                // Done!
                warptrace (1, "WarpPageView.initialize", "Final callback for: "+this.getEntityProxy().displayName());
                callback();
            }
        }
    }
}

WarpPageView.prototype.toString = function (spacing) {
    if (!spacing) spacing = 1;
    var spaces = "";
    for (var idx = 0; idx<spacing; idx++) spaces += " ";
    var str = "\n" + spaces;
    if (this.getEntityProxy()) {
        var dn = this.entityType;
        if (this.getEntityProxy().data) {
            dn = this.getEntityProxy().displayName()
            dn += " (" + (this.getEntityProxy().isDocument ? "Document" : "Embedded") + ")";
        }
        str += "* PageView [type=" + this.entityType + ", widgetID=" + this._wID + "]:";
        str += "\n" + spaces + "  - " + "EntityProxy: " + dn;
    }
    else {
        str += "* " + this.globalID() + " - no EntityProxy!";
    }
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
    this.position = parseInt('' + config.position);
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
            pi.init();
            break;
        case 'Table':
            pi = new WarpRPI_Table(this, config);
            pi.init();
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
    var ep = this.getPageView().getEntityProxy();
    ep.useData(function (entity) {
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
        textDiv.prop('class', 'col-sm-10');

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
    if (config.isAggregation)
        throw "Style 'CSV' currently only supported for associations!"
    WarpRelationshipPanelItem.call(this, parent, config);
}

WarpRPI_CSV.prototype = Object.create(WarpRelationshipPanelItem.prototype);
WarpRPI_CSV.prototype.constructor = WarpRPI_CSV;

WarpRPI_CSV.prototype.createViews = function() {
    var form = $('<form class="form-horizontal"></form>');
    var formGroup = $('<div class="form-group"></div>');

    var label = $('<label></label>');
    label.prop('for', this.globalID());
    label.prop('class', 'col-sm-2 control-label');
    label.text(this.label);

    var csvEditorDiv = $('<div></div>');
    csvEditorDiv.prop('class', 'col-sm-10');

    var startEditorButton = $('<button type="button" class="btn btn-sm">Edit</button>');
    csvEditorDiv.append(startEditorButton);
    csvEditorDiv.on('click', this.openAssociationEditor.bind(this));

    form.append(formGroup);
    formGroup.append(label);
    formGroup.append(csvEditorDiv);

    return form;
}

WarpRPI_CSV.prototype.openAssociationEditor = function() {
    var pv = this.getPageView();
    var sourceEntityProxy = pv.getEntityProxy();
    var assocEditor = new WarpAssociationEditor(sourceEntityProxy, this.relationshipID, this.globalID() + "_edit");
    assocEditor.init();
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
    this.config = config;
}

WarpRPI_Table.prototype = Object.create(WarpRelationshipPanelItem.prototype);
WarpRPI_Table.prototype.constructor = WarpRPI_Table;

WarpRPI_Table.prototype.init = function() {
    // Table needs a TableView
    var relnID = this.config.relationship[0];
    var reln = this.getWarpJSClient().model.getRelationshipByID(relnID);
    this.targetEntity = this.getWarpJSClient().model.getEntityByID(reln.targetEntity[0]);

    var tv = null;
    if (this.config.view) {
        tv = this.config.view;
    }
    else { // Get default view
        tv = this.getWarpJSClient().model.getDefaultTableView(this.targetEntity);
    }

    var tableConfig = {
        relationshipProxy: this.getRelationshipProxy(),
        globalID: this.globalID() + "_table",
        callbackRowSelected: WarpRPI_Table.prototype.rowSelected,
        callbackAdd: WarpRPI_Table.prototype.add.bind(this),
        callbackContext: this,
        tableViewJson: tv
    }
    this.warpTable = new WarpTable(tableConfig);
}

WarpRPI_Table.prototype.createViews = function() {
    return this.warpTable.createViews();
}

WarpRPI_Table.prototype.updateViewWithDataFromModel = function() {
    this.warpTable.updateViewWithDataFromModel();
}

WarpRPI_Table.prototype.updateModelWithDataFromView = function() {
}

WarpRPI_Table.prototype.add = function() {
    warptrace(1, "WarpRPI_Table.add():\n-  Add-Click for "+this.globalID());
}
WarpRPI_Table.prototype.rowSelected = function() {
    warptrace(1, "WarpRPI_Table.rowSelected():\n-  Click for " + this.type + ', id:' + this.id);
    url = $warp.links.domain.href + "/" + this.type + '?oid=' + this.id;
    window.location.href = url;
}

//
// Class "WarpRPI_Carousel"
//

function WarpRPI_Carousel(parent, config) {
    WarpRelationshipPanelItem.call(this, parent, config);
    this.childPageView = null;
    this.config = config;
}

WarpRPI_Carousel.prototype = Object.create(WarpRelationshipPanelItem.prototype);
WarpRPI_Carousel.prototype.constructor = WarpRPI_Carousel;

WarpRPI_Carousel.prototype.init = function() {
    // Carousel needs a a PageView:
    var relnID = this.config.relationship[0];
    var reln = this.getWarpJSClient().model.getRelationshipByID(relnID);
    var targetEntity = this.getWarpJSClient().model.getEntityByID(reln.targetEntity[0]);

    var pv = null;
    if (this.config.view) {
        pv = this.config.view;
    }
    else { // Get default view
        pv = this.getWarpJSClient().model.getDefaultPageView(targetEntity);
    }
    pv.localID = "pv";
    pv.entityType = targetEntity.name;
    this.childPageView = this.getPageView().addChildPageView(this, pv);
}
WarpRPI_Carousel.prototype.createViews = function() {
    var mainElem =      $('<div></div>');
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
    panel.prop('id', this.globalID() + '_panel');
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

    mainElem.append(panel);

    // Also prepare alert to be shown in case relationship has no elements:
    var hrefAdd2 = $('<a href="#"><span class="glyphicon glyphicon-plus-sign"></span></a>');
    hrefAdd2.click(this.add.bind(this));
    var alert = $('<div class="alert alert-success">Click here to add new element to ' + this.label + ': </div>');
    alert.prop('id', this.globalID() + '_alert');
    alert.append(hrefAdd2);

    mainElem.append(alert);

    return mainElem;
}

WarpRPI_Carousel.prototype.updateViewWithDataFromModel = function() {
    var rp = this.getRelationshipProxy();
    rp.useRelationship(function(relnProxy) {
        if (relnProxy.noOfTotalQueryResults() === 0) {
            $("#" + this.globalID() + '_panel').hide();
            $("#" + this.globalID() + '_alert').show();
            return;
        }
        $("#" + this.globalID() + '_panel').show();
        $("#" + this.globalID() + '_alert').hide();

        var from = 1 + relnProxy.currentPage * relnProxy.entitiesPerPage;
        var to = Math.min(
            from + relnProxy.entitiesPerPage - 1,
            relnProxy.noOfTotalQueryResults());

        var idx = relnProxy.selectedEntityIdx + from;
        var idxStr = idx + "/" + relnProxy.noOfTotalQueryResults();

        $('#' + this.globalID() + '_idx').html(idxStr);

        // Update selection list
        var select = $('#'+this.globalID() + '_select');
        select.empty();
        var option = $('<option>Showing matches from ' + from + ' to ' + to + '</option>');
        select.append(option);
        var option = $('<option>---------------------</option>');
        select.append(option);
        relnProxy.allQueryResults().forEach(function(entity, idx) {
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

WarpRPI_Carousel.prototype.selectEntityAndUpdate = function(selection) {
    this.updateModelWithDataFromView();
    this.getRelationshipProxy().useRelationship(function(relnProxy) {
        switch (selection) {
            case "+1":
                relnProxy.incrementEntitySelection();
                break;
            case "-1":
                relnProxy.decrementEntitySelection();
                break;
            default:
                if (!typeof selection === "number")
                    throw "Invalid selection: " + selection;
                relnProxy.setSelectedEntity(selection);
        }

        relnProxy.useRelationship(function (relnProxy) {
            var proxyForSelectedEntity = relnProxy.getProxyForSelectedEntity();
            this.childPageView.reset(this.childPageView.config, proxyForSelectedEntity);
            this.childPageView.initialize(function () {

                var newViews = this.createViews();
                var parentElem = $('#' + this.getParent().globalID());
                parentElem.empty();
                parentElem.append(newViews);
                this.updateViewWithDataFromModel();

                warptrace(2, "--------------- Updated View Hierarchy ---------------");
                warptrace(2, $warp.pageView.toString());
                warptrace(2, "--------------- ---------------------- ---------------");

            }.bind(this));
        }.bind(this));
    }.bind(this));
}

WarpRPI_Carousel.prototype.select = function(e) {
    warptrace(1, "WarpRPI_Carousel.select():\n-  New selection for "+this.globalID());
    var idx = parseInt(e.target.value);
    this.selectEntityAndUpdate (idx);
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
    warptrace(1, "WarpRPI_Carousel.add():\n-  (+)-Click for "+this.globalID());
}
WarpRPI_Carousel.prototype.del = function() {
    warptrace(1, "WarpRPI_Carousel.del():\n-  (-)-Click for "+this.globalID());
}


//
// Class "WarpTable"
//

function WarpTable(tableConfig) {
    this.relationshipProxy = tableConfig.relationshipProxy;
    this.callbackRowSelected = tableConfig.callbackRowSelected;
    this.callbackAdd = tableConfig.callbackAdd;
    this.callbackContext = tableConfig.callbackContext;
    this.tableViewJson = tableConfig.tableViewJson;
    this._globalID = tableConfig.globalID;
}

WarpTable.prototype.globalID = function() {
    return this._globalID;
}

WarpTable.prototype.createViews = function() {
    var mainElem = $('<div></div>');

    // Table
    var table = $('<table class="table table-sm table-hover"></table>');
    table.prop('id', this.globalID());

    // Pagination
    var formInline =        $('<form    class="form-inline"></form>');
    var formGroup =         $('<div     class="form-group"></div>');
    var inputGrp =          $('<div     class="input-group"></div>');
    var inputGrpAddonLft =  $('<div     class="input-group-addon"></div>');
    var inputGrpAddonIdx =  $('<div     class="input-group-addon">IDX</div>');
    var hrefLft =           $('<a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a>');
    var inputGrpAddonRgt =  $('<div     class="input-group-addon"></div>');
    var hrefRgt =           $('<a href="#"><span class="glyphicon glyphicon-chevron-right"></span></a>');

    var inputGrpAddonAdd =  $('<div     class="input-group-addon"></div>');
    var hrefAdd =           $('<a href="#"><span class="glyphicon glyphicon-plus-sign"></span></a>');

    // Bind event handlers
    hrefLft.click(this.left.bind(this));
    hrefRgt.click(this.right.bind(this));

    // Has "+" function?
    if (this.add) {
        hrefAdd.click(this.add.bind(this));
        inputGrpAddonAdd.append(hrefAdd);
        inputGrp.append(inputGrpAddonAdd);
    }
    // Misc
    inputGrpAddonIdx.prop('id', this.globalID() + '_idx');

    // Create Hierachy
    inputGrpAddonLft.append(hrefLft);
    inputGrpAddonRgt.append(hrefRgt);
    inputGrp.append(inputGrpAddonLft);
    inputGrp.append(inputGrpAddonIdx);
    inputGrp.append(inputGrpAddonRgt);
    formGroup.append(inputGrp);
    formInline.append(formGroup);

    // Putting it together
    mainElem.append(table);
    mainElem.append(formInline);
    return mainElem;
}

WarpTable.prototype.updateViewWithDataFromModel = function() {
    this.relationshipProxy.useRelationship (function(relnProxy) {
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
        relnProxy.allQueryResults().forEach(function(entity) {
            // Create new row for each entity:
            tr = $('<tr></tr>');
            this.tableViewJson.tableItems.forEach(function(tableItem) {
                var propertyID = tableItem.property[0];
                var property = $warp.model.getPropertyByID(propertyID);
                var td = $('<td>' + entity.getValue(property.name) + '</td>');
                tr.append(td);
            });
            if (entity.isDocument) {
                var target = {id: entity.data._id, type: entity.type, context: this.callbackContext };
                tr.on('click', this.callbackRowSelected.bind(target));
            }
            body.append(tr);
        }.bind(this));

        // Putting it together:
        var table = $('#' + this.globalID());
        table.empty();
        table.append(thead);
        table.append(body);

        // Update pagination menu:
        var from = relnProxy.currentPage * relnProxy.entitiesPerPage + 1;
        var to = Math.min(
            from + relnProxy.entitiesPerPage - 1,
            relnProxy.noOfTotalQueryResults());
        var idxStr = from + '-' + to + '/' + relnProxy.noOfTotalQueryResults();
        $('#' + this.globalID() + '_idx').html(idxStr);
    }.bind(this));
}

WarpTable.prototype.updateModelWithDataFromView = function() {
}

WarpTable.prototype.selectPageAndUpdate = function(selection) {
    this.updateModelWithDataFromView();
    this.relationshipProxy.useRelationship(function(relnProxy) {
        switch (selection) {
            case "+1":
                relnProxy.incrementSelectedPage();
                break;
            case "-1":
                relnProxy.decrementSelectedPage();
                break;
            default:
                throw "Invalid selection: " + selection;
        }
        relnProxy.useRelationship(function(relnProxy) {
            this.updateViewWithDataFromModel();
        }.bind(this));
    }.bind(this));
}

WarpTable.prototype.left = function() {
    warptrace(1, "WarpTable.left():\n-  Left-Click for "+this.globalID());
    this.selectPageAndUpdate("-1");
}
WarpTable.prototype.right = function() {
    warptrace(1, "WarpTable.right():\n-  Right-Click for "+this.globalID());
    this.selectPageAndUpdate("+1");
}

//
// Class "WarpAssociationEditor"
//

function WarpAssociationEditor (sourceEntityProxy, relationshipID, globalID) {
    this.sourceEntityProxy = sourceEntityProxy;
    this.relationshipID = relationshipID;
    this.maxAssocs = 6;
    this._globalID = globalID;
}

WarpAssociationEditor.prototype.init = function() {
    // Get relationship details:
    this.relnJson = $warp.model.getRelationshipByID (this.relationshipID);
    this.sourceJson = $warp.model.getRelnParentByID (this.relationshipID);
    this.targetJson = $warp.model.getEntityByID(this.relnJson.targetEntity[0]);

    // List of derived entities
    var derivedEntities = $warp.model.getDerivedEntitiesByID(this.targetJson.id);
    var targetEntites = [];
    if (!this.targetJson.isAbstract)
        targetEntites.push (this.targetJson);
    derivedEntities.forEach (function (derivedEntity) {
        if (!derivedEntity.isAbstract)
            targetEntites.push(derivedEntity);
    });

    // Prepare selection list with real and derived entities:
    $("#WarpJS_assocSelectionModal_selectFromType").empty();
    targetEntites.forEach(function (entity, idx) {
        var option = $('<option></option>');
        option.text (entity.name);
        option.prop('value', idx);
        if (idx===0)
            option.prop('selected', 'selected');
        $("#WarpJS_assocSelectionModal_selectFromType").append(option);
    });

    // Relationship proxy for selection targets:
    this.assocProxy = new AssociationProxy(this.relnJson, this.sourceEntityProxy);
    this.assocProxy.entitiesPerPage = this.maxAssocs;

    // Table view for target
    var tv = $warp.model.getDefaultTableView(this.targetJson);

    var tableConfig = {
        relationshipProxy: this.assocProxy.getAssocTargetsProxy(),
        globalID: this.globalID() + "_selectionTable",
        callbackRowSelected: function () {
            this.context.addSelection(this.id, this.type); },
        callbackAdd: null,
        callbackContext: this,
        tableViewJson: tv
    }

    var entitySelectionTable = new WarpTable(tableConfig);
    $("#WarpJS_assocSelectionModal_selectFromTable").empty().append(entitySelectionTable.createViews());
    entitySelectionTable.updateViewWithDataFromModel();

    // Update selections
    this.updateSelections();

    // Don't show selection details initially:
    $('#WarpJS_assocSelectionModal_selectionDetails').hide();

    $("#associationEditorM").modal();
}

WarpAssociationEditor.prototype.globalID = function() {
    return this._globalID;
}

WarpAssociationEditor.prototype.updateSelections = function() {
    var label = $('<li class="disabled"><a href="#">Selected:</a></li>');
    var ul = $('<ul class="nav nav-pills"></ul>');
    ul.append(label);
    $("#WarpJS_assocSelectionModal_selectionList").empty().append(ul);
    this.assocProxy.useRelationship(function(assocProxy) {
        for (var idx = 0; idx < this.assocProxy.noOfResultsOnCurrentPage(); idx++) {
            this.assocProxy.queryResult(idx).useData (function (proxy) {
                var name = proxy.displayName();
                var targetID = proxy.data._id;
                var desc = this.assocProxy.getAssocDataByTargetID(targetID).desc;
                var li = $('<li><a href="#">' + name + '</a></li>');
                li.on('click', function() {
                    this.context.editDetails (this.id, this.name, this.desc);
                }.bind({ id: targetID, name: name, desc:desc, context:this }));
                ul.append(li);
            }.bind(this));
        }
    }.bind(this));
}

var formInline =        $('<form    class="form-inline"></form>');
var formGroup =         $('<div     class="form-group"></div>');

WarpAssociationEditor.prototype.editDetails = function(id, name, desc) {
    var edit = $('#WarpJS_assocSelectionModal_selectionDetails');
    var fg = $('<div class="form-group"></div>');
    var lbl = $('<label for="comment">Description for selection \'' + name + '\':</label>');
    var txt = $('<textarea class="form-control" rows="3" id="WarpJS_assocSelectionModal_selectionDetails_input"></textarea>');
    var btnGrp = $('<div class="btn-group-sm" role="group" aria-label="Basic example" style="margin-top: 5px;">');

    txt.val(desc);

    var button1 =   $('<button type="button" class="btn btn-secondary">Confirm</button>');
    button1.on('click', function () {
        this.context.confirm(this.id);
    }.bind({ context:this, id: id}));

    var button2 =   $('<button type="button" class="btn btn-secondary">Remove from Selection</button>');
    button2.on('click', function () {
        this.context.removeFromSelection(this.id);
    }.bind({ context:this, id: id}));

    btnGrp.append(button1).append(button2);
    fg.append(lbl).append(txt).append(btnGrp);

    edit.empty().append(fg);
    $('#WarpJS_assocSelectionModal_selectionDetails').show();
}

WarpAssociationEditor.prototype.addSelection = function(id, type) {
    this.assocProxy.useRelationship(function (assocProxy) {
        if (assocProxy.noOfTotalQueryResults() >= this.maxAssocs) {
            alert ("Reached max no. of associations currently supported: " + this.maxAssocs);
            return;
        }
        this.assocProxy.addToAssocTargets(id, type);
        this.updateSelections();
    }.bind(this));
}

WarpAssociationEditor.prototype.removeFromSelection = function(id) {
    this.assocProxy.useRelationship(function (assocProxy) {
        this.assocProxy.removeFromAssocTargets(id);
        this.updateSelections();
    }.bind(this));
}

WarpAssociationEditor.prototype.confirm = function(id) {
    this.assocProxy.useRelationship(function(assocProxy) {
        var desc = $('#WarpJS_assocSelectionModal_selectionDetails_input').val();
        assocProxy.updateAssocData(id, desc);
        this.updateSelections();
    }.bind(this));
}
