//
// Class EntityProxy
//

function EntityProxy(type, mode, parentRelnProxy) {
    this.type = type;
    this.mode = mode ? mode : "undefined";
    if (parentRelnProxy)
        this.parentRelnProxy = parentRelnProxy;

    this.isDocument = "undefined";
    this.data = null;
    this.relationships = {};
    this.history = [];

    $warp.entityCache.push(this);
}

EntityProxy.prototype.useData = function(callback) {
    switch (this.mode) {
        case "rootInstance":
            this.useRootInstance(callback);
            break;
        case "editEntity":
            if (this.oid) {
                this.getEntityByOID (callback);
            }
            else if (this.parentRelnProxy) {
                this.parentRelnProxy.useRelationship(function (relnProxy) {
                    var arg = relnProxy.queryResults && relnProxy.queryResults.length>0 ? relnProxy.queryResults[0] : null;
                    callback (arg);
                });
            }
            else
                throw "Currently not supported!";
            break;
        case "addNewEntity":
            callback(this);
            break;
        default:
            throw "Invalid mode for entity: '"+this.mode+"'";
    }
}


EntityProxy.prototype.getValue = function(attrName) {
    return this.data[attrName];
}

EntityProxy.prototype.setValue = function(attrName, val) {
    if (this.data[attrName] !== val) {
        this.history.push({ date: new Date(), attribute: attrName, newVal: val });
        this.data[attrName] = val;
    }
}

EntityProxy.prototype.getRelationship = function(relnID) {
    if (this.relationships[relnID])
        return this.relationships[relnID];
    else {
        var jsonEntity = $warp.model.getEntityByName(this.type);
        var jsonReln = $warp.model.getRelationshipByID(relnID);
        var newReln = new RelationshipProxy(jsonReln, this);
        this.relationships[name] = newReln;
        return newReln;
    }
}

EntityProxy.prototype.getDataViaOID = function(callback) {
}

EntityProxy.prototype.getDataViaParentReln = function(callback) {
    this.parentRelnProxy.useRelationship(function (relnProxy) {
        // Try to use the first element in the relationship:
        var arg = relnProxy.queryResults && relnProxy.queryResults.length>0 ? relnProxy.queryResults[0] : null;
        if (!arg)
            console.log("Warning: getDataViaParentReln() with empty query result!");
        callback (arg);
    });
}

EntityProxy.prototype.getEntityByOID = function(handleResult) {
    if (this.data) {
        handleResult(this);
        return;
    }
}

EntityProxy.prototype.useRootInstance = function(handleResult) {
    if (this.data) {
        console.log("Re-using RootInstance data!");
        handleResult(this);
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
            console.log("Loaded RootInstance with ID: " + rootInstanceFromServer._id);
            $warp.getPageView().getActiveEntity().data = rootInstanceFromServer;
            handleResult($warp.getPageView().getActiveEntity());
        }
        else {
            alert(result.err);
        }
    });
}

//
// Class "RelationshipProxy"
//

function RelationshipProxy(jsonReln, parent) {
    this.parent = parent;
    this.jsonReln = jsonReln;

    this.name = jsonReln.name;
    this.id = jsonReln.id;
    this.isAggregation = jsonReln.isAggregation;
    this.targetType = $warp.model.getEntityByID (jsonReln.targetEntity[0]).name;
    this.parentType = $warp.model.getRelnParentByID (jsonReln.id).name;

    this.currentPage = 0;
    this.entitiesPerPage = 5;
    this.maxNumberOfPages = 5;
    this.activeEntityIdx = -1;
    this.filter = null;

    this.queryResults = [];
    this.queryResultsCount = -1;

    // Used only for associations, to determine potential targets:
    this.assocTargets = [];
}

RelationshipProxy.prototype.getParentEntity = function () {
    return this.parent;
}

RelationshipProxy.prototype.setActiveEntityIdx = function (idx) {
    if (idx<0 || idx>this.queryResults.length)
        console.log("Warning: ActiveEntityIdx is out of bounds!");
    this.activeEntityIdx = idx;
}

RelationshipProxy.prototype.getActiveEntity = function () {
    if (this.queryResults[this.activeEntityIdx])
        return this.queryResults[this.activeEntityIdx];
    else
        return new EntityProxy(this.targetType, "editEntity", this);
}

RelationshipProxy.prototype.setFilter = function (f) {
    this.filter = f;
    this.currentPage = 0;
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
                    // queryResult["_id"], queryResult.type, queryResult
                    console.log("Result: "+queryResult["_id"]+" - "+queryResult.type);
                });
                callback();
            }
            console.log("Failed to post CRUD commands: " + result.error);
        },
        error: function () {
            console.log("Error while posting CRUD commands!");
        }
    });
}

RelationshipProxy.prototype.useRelationship = function (callback) {
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
    this.debugCommand = command;
    this.getParentEntity().useData(function(parentEntity) {
        command.parentID = parentEntity.getValue('_id');
        console.log("ParentEntity:"+command.parentID);
        var reqData = {commandList: []};
        reqData.commandList.push(command);
        $warp.processCRUDcommands(reqData, function (result) {
            if (result.success) {
                entityDocs = result.resultList[0].queryResult;
                this.queryResultsCount = entityDocs.length;
                this.queryResults = [];
                entityDocs .forEach (function (entityDoc) {
                    var proxy = new EntityProxy(entityDoc.type, "editEntity");
                    proxy.data = entityDoc;
                    this.queryResults.push (proxy);
                }.bind(this));
                callback(this);
            }
        }.bind(this));
    }.bind(this));
}

//
// Class WarpWidget - base class for all WarpJS widgets
//

function WarpWidget(parent, config) {
    if (config === null || typeof config === "undefined")
        throw "Fatal: Can not add child to WarpWidget without 'config'!";
    if (config.localID !== "WarpJS" && (parent === null || typeof parent === "undefined"))
        throw "Fatal: Can not add child to WarpWidget without 'parent'!";
    if (config.localID === null || typeof config.localID === "undefined")
        throw parent.globalID()+": Can not add child with invalid localID!";

    this._parent = parent;
    this._localID = config.localID;
    this._warpJSClient = null;

    this._globalID = (this.hasParent() ? this.getParent().globalID()+"_" : "") + this._localID;

    this.getWarpJSClient().addToViewCache(this);
}

WarpWidget.prototype.getWarpJSClient = function() {
    if (!this._warpJSClient) {
        var parent = this;
        while (parent.getParent()) parent = parent.getParent();
        this._warpJSClient=parent;
    }
    return this._warpJSClient;
}

WarpWidget.prototype.readViewDataFromModel = function() {
    throw "readViewDataFromModel(): This function must be implemented by child classes";
}
WarpWidget.prototype.writeViewDataToModel = function() {
    throw "writeViewDataFromModel(): This function must be implemented by child classes";
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
    this.viewCache = []; // Must be initialized first!
    this.entityCache = [];

    WarpWidget.call(this, null, { localID: "WarpJS" });

    this.pageView = null;
    this.breadcrumb = null;
    this.model = null;
}

WarpJSClient.prototype = Object.create(WarpWidget.prototype);
WarpJSClient.prototype.constructor = WarpJSClient;

// Overwrite default to handle special cases
WarpJSClient.prototype.useActiveEntity = function(callback) {
    this.getPageView().getActiveEntity().useData (callback);
}

WarpJSClient.prototype.getPageView = function() {
    return this.pageView;
}

WarpJSClient.prototype.readViewDataFromModel = function() {
    this.breadcrumb.readViewDataFromModel();
    this.pageView.readViewDataFromModel();
}
WarpJSClient.prototype.writeViewDataToModel = function() {
    this.breadcrumb.writeViewDataToModel();
    this.pageView.writeViewDataToModel();
}

WarpJSClient.prototype.addToViewCache = function(w1) {
    this.viewCache.forEach(function(w2) {
        if (w1.globalID() === w2.globalID())
            throw "Error: Widget with id='"+w1.globalID()+"' already exists in widget cache!";
    })
    this.viewCache.push(w1);
}

WarpJSClient.prototype.addBreadcrumb = function(config) {
    this.breadcrumb = new WarpBreadcrumb(this, config);
    return this.breadcrumb;
}

WarpJSClient.prototype.addPageView = function(config) {
    this.pageView = new WarpPageView(this, config);

    for (var idx=0; config.panels && idx<config.panels.length; idx++) {
        var panel=config.panels[idx];
        panel.localID = "panel"+idx;
        this.pageView.addPanel(panel);
    }

    return this.pageView;
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

WarpJSClient.prototype.save = function() {
    this.writeViewDataToModel();
    console.log("TBD: Write to server!");
}

function initializeWarpJS (jsonData, config, callback) {
    $warp = new WarpJSClient;
    $warp.initialize (jsonData, config, callback);
}

WarpJSClient.prototype.initialize = function(jsonData, config, callback) {
    // Remember domain for this client:
    $warp.domain = config.domainName;

    // Get page view
    this.model = new WarpModelParser(jsonData);
    var entityDefn = this.model.getEntityByName(config.entityType);
    if (!entityDefn) throw "Can`t find entity:"+config.entityType;
    var defaultView = this.model.getPageView(entityDefn, config.viewName);
    defaultView.entityType = config.entityType;

    // Build WarpViews
    defaultView.localID = "mainPV";
    defaultView.style = "tabs";
    this.addPageView(defaultView);
    this.addBreadcrumb({ localID: "breadcrumb" });

    // Handle URL Arguments: editEntity || addEntity || rootInstance
    var entity = new EntityProxy(config.entityType);
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
    this.pageView.setActiveEntity(entity);

    // Create HTML views (after "ActiveEntity" was added!!!)
    var htmlViews = this.createViews();
    $("#"+config.htmlElements.rootElem).append(htmlViews);
    // Debug HTML: console.log(htmlViews.html());

    // HTML Bindings
    $("#"+config.htmlElements.saveButton).on("click", this.save.bind(this));

    // Prepare remote connection
    $.ajax({
        headers: {
            'Accept': 'application/hal+json'
        },
        success: function (result) {
            $warp.links = result._links;

            // Pre-load data for entities...
            $warp.pageView.useActiveEntity(function(entity) {
                // And now populate the views...
                console.log("OK!!!");
                $warp.readViewDataFromModel();
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
                console.log("Failed to post CRUD commands: " + result.error);
            }
        },
        error: function () {
            console.log("Error while posting CRUD commands!");
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

WarpBreadcrumb.prototype.readViewDataFromModel = function() {
    console.log("TBD: Update Breadcrumb");
}
WarpBreadcrumb.prototype.writeViewDataToModel = function() {
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
    if (!config.entityType) throw "PageView must have entityType!";
    this.entityType = config.entityType;

    WarpWidget.call(this, parent, config);

    if (config.parentRelnProxy)
        this.parentRelnProxy = config.parentRelnProxy;
    this.label = config.label;
    this.style = config.style;
    this.panels = [];
    this._activeEntity = null;
}

WarpPageView.prototype = Object.create(WarpWidget.prototype);
WarpPageView.prototype.constructor = WarpPageView;

// Overwrite defaults:
WarpPageView.prototype.getPageView = function() {
    return this;
}
WarpPageView.prototype.getActiveEntity = function() {
    if (!this._activeEntity) {
        // Try to get the first element of the parent relationship
        var rpi = this.getParent(); // RelationshipPanelItem containing this PageView
        var parentPV = rpi.getPageView(); // Parent PV of this PageView
        var reln = parentPV.getActiveEntity().getRelationship (rpi.relationshipID);
        this.setActiveEntity(reln.getActiveEntity());
    }

    return this._activeEntity;
}
WarpPageView.prototype.setActiveEntity = function(entity) {
    this._activeEntity = entity;
}

WarpPageView.prototype.useActiveEntity = function(callback) {
    var entity = this.getActiveEntity.useData(callback);
    if (entity.data) {
        callback(entity);
    }
    else if (entity.oid) {
        entity.getDataViaOID(callback);
    }
    else if (entity.parentRelnProxy) {
        entity.getDataViaParentReln(callback);
    }
    else {
        callback(null);
    }
}

WarpPageView.prototype.readViewDataFromModel = function() {
    this.panels.forEach(function(panel) { panel.readViewDataFromModel(); });
}
WarpPageView.prototype.writeViewDataToModel = function() {
    this.panels.forEach(function(panel) { panel.writeViewDataToModel(); });
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
    var panel =         $('<div class="panel panel-success"></div>');
    var panelHeading =  $('<div class="panel-heading"><b>'+this.label+'</b></div>');
    var panelBody =     $('<div class="panel-body"></div>');

    panel.append(panelHeading);
    panel.append(panelBody);

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
        panelBody.append(navTabs);
        panelBody.append(tabContent);
    }

    return panel;
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

WarpPanel.prototype.readViewDataFromModel = function() {
    this.panelItems.forEach(function(panelItem) { panelItem.readViewDataFromModel(); });
}
WarpPanel.prototype.writeViewDataToModel = function() {
    this.panelItems.forEach(function(panelItem) { panelItem.writeViewDataToModel(); });
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
            pv.parentRelnProxy = reln;
            pi.addPageView(pv);
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

WarpPanelItem.prototype.readViewDataFromModel = function() {
    if (this.type !== "Separator") throw "Internal error - function must be overridden";
}
WarpPanelItem.prototype.writeViewDataToModel = function() {
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

WarpBasicPropertyPanelItem.prototype.readViewDataFromModel = function() {
    this.getPageView().useActiveEntity(function (entity) {
        if (entity) {
            var input = $("#" + this.globalID());
            input.val(entity.getValue(this.propertyName));
        }
        else
            console.log("Warning: Could not get data from model for BasicPropertyPanelItem, ID="+this.globalID());
    }.bind(this));
}
WarpBasicPropertyPanelItem.prototype.writeViewDataToModel = function() {
    this.getPageView().useActiveEntity(function (entity) {
        var input = $("#"+this.globalID());
        entity.setValue(this.propertyName, input.val());
        console.log("Update: "+this.propertyName+"="+entity[this.propertyName]);
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

WarpEnumPanelItem.prototype.readViewDataFromModel = function() {
    this.getPageView().useActiveEntity(function (entity) {
        if (entity) {
        var select = $("#"+this.globalID());
        select.val(entity.getValue(this.propertyName));
        }
        else
            console.log("Warning: Could not get data from model for EnumPanelItem, ID="+this.globalID());
    }.bind(this));
}
WarpEnumPanelItem.prototype.writeViewDataToModel = function() {
    this.getPageView().useActiveEntity(function (entity) {
        var select = $("#"+this.globalID());
        entity.setValue(this.propertyName, select.val());
        console.log("Update: "+this.propertyName+"="+entity[this.propertyName]);
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
}

WarpRelationshipPanelItem.prototype = Object.create(WarpPanelItem.prototype);
WarpRelationshipPanelItem.prototype.constructor = WarpRelationshipPanelItem;

WarpRelationshipPanelItem.prototype.getRelationship = function() {
    return this.getPageView().getActiveEntity().getRelationship(this.relationshipID);
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

WarpRPI_CSV.prototype.readViewDataFromModel = function() {
    console.log("Warning: 'readViewDataFromModel' for 'WarpRPI_CSV' currently not implemented!");
}

WarpRPI_CSV.prototype.writeViewDataToModel = function() {
    console.log("Warning: 'writeViewDataToModel' for 'WarpRPI_CSV' currently not implemented!");
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

WarpRPI_Table.prototype.readViewDataFromModel = function() {
    var relnProxy = this.getRelationship();
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

WarpRPI_Table.prototype.writeViewDataToModel = function() {
    console.log("Warning: 'writeViewDataToModel' for 'WarpRPI_Table' currently not implemented!");
}

//
// Class "WarpRPI_Carousel"
//

function WarpRPI_Carousel(parent, config) {
    WarpRelationshipPanelItem.call(this, parent, config);
    this.pageView = null;
}

WarpRPI_Carousel.prototype = Object.create(WarpRelationshipPanelItem.prototype);
WarpRPI_Carousel.prototype.constructor = WarpRPI_Carousel;

WarpRPI_Carousel.prototype.addPageView = function(config) {
    this.pageView = new WarpPageView(this, config);

    for (var idx=0; config.panels && idx<config.panels.length; idx++) {
        var panel=config.panels[idx];
        panel.localID = "panel"+idx;
        this.pageView.addPanel(panel);
    }

    return this.pageView;
}

WarpRPI_Carousel.prototype.createViews = function() {
    var res =               $('<div></div>');

    var formInline =        $('<form    class="form-inline"></form>');
    formInline.prop('style', 'padding-bottom:10px')
    var formGroup =         $('<div     class="form-group"></div>');
    var inputGrp =          $('<div     class="input-group"></div>');
    var inputGrpAddonLft =  $('<div     class="input-group-addon"></div>');
    var hrefLft =           $('<a href="#"><span class="glyphicon glyphicon-chevron-left"></span></a>');
    var inputGrpSelect =    $('<select  class="form-control">' +
        '<option>very long</option>' +
        '<option>short</option>' +
        '</select>');
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
    inputGrpSelect.prop('id', this.globalID() + '_select');
    inputGrpSelect.change(this.select.bind(this));

    // Create Hierachy

    inputGrpAddonLft.append(hrefLft);
    inputGrpAddonRgt.append(hrefRgt);
    inputGrpAddonAdd.append(hrefAdd);
    inputGrpAddonDel.append(hrefDel);

    inputGrp.append(inputGrpAddonLft);
    inputGrp.append(inputGrpSelect);
    inputGrp.append(inputGrpAddonRgt);
    inputGrp.append(inputGrpAddonAdd);
    inputGrp.append(inputGrpAddonDel);

    formGroup.append(inputGrp);
    formInline.append(formGroup);

    res.append(formInline);
    res.append(this.pageView.createViews());

    return res;
}

WarpRPI_Carousel.prototype.left = function() {
    console.log("Left-Click for: "+this.globalID());
}
WarpRPI_Carousel.prototype.right = function() {
    console.log("Right-Click for: "+this.globalID());
}
WarpRPI_Carousel.prototype.add = function() {
    console.log("(+)-Click for: "+this.globalID());
}
WarpRPI_Carousel.prototype.del = function() {
    console.log("(-)-Click for: "+this.globalID());
}
WarpRPI_Carousel.prototype.select = function(e) {
    var txt = $('#'+this.globalID() + '_select').val();
    console.log("New selection for: "+this.globalID()+" - "+txt);
}

WarpRPI_Carousel.prototype.readViewDataFromModel = function() {
    if (this.pageView)
        this.pageView.readViewDataFromModel();
    else
        console.log("Warning: RelationshipPanelItem without PageView! (ID:"+this.globalID()+")");
}

WarpRPI_Carousel.prototype.writeViewDataToModel = function() {
    if (this.pageView)
        this.pageView.writeViewDataToModel();
    else
        console.log("Warning: RelationshipPanelItem without PageView! (ID:"+this.globalID()+")");
}
