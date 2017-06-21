const AggregationProxy = require('./aggregation-proxy');
const AssociationProxy = require('./association-proxy');
const utils = require('./../utils');

class EntityProxy {
    constructor(entityConfig) {
        this.type = entityConfig.type;
        this.isDocument = entityConfig.isDocument;
        this.mode = entityConfig.mode;

        // Potentially null:
        this.data = entityConfig.data;
        this.parentRelnProxy = entityConfig.parentRelnProxy;

        if (this.isDocument) {
            this.isDirty = false;
        }

        switch (this.mode) {
            case "rootInstance":
                break;
            case "editEntity":
                this.oid = entityConfig.oid;
                if (!this.oid || this.oid.length === 0) {
                    throw new Error("Can't create EntityProxy in mode 'editEntity' without valid 'oid'!");
                }
                break;
            case "addNewEntity":
                this.parentID = entityConfig.parentID;
                this.relnID = entityConfig.relnID;
                this.relnName = entityConfig.relnName;
                this.parentBaseClassName = entityConfig.parentBaseClassName;
                this.parentBaseClassID = entityConfig.parentBaseClassID;
                break;
            default:
                throw new Error("Invalid mode: " + this.mode);
        }

        this.relationships = {};
        this.history = [];

        $warp.entityCacheAdd(this);
    }

    getParentRelationship() {
        return this.parentRelnProxy;
    }

    getParentEntity() {
        return this.getParentRelationship().getParentEntity();
    }

    getDocumentProxy() {
        if (this.isDocument) {
            return this;
        } else {
            return this.getParentEntity().getDocumentProxy();
        }
    }

    addRelationshipProxy(relnProxy) {
        this.relationships[relnProxy.id] = relnProxy;
    }

    getRelationshipProxy(relnID) {
        if (this.relationships[relnID]) {
            return this.relationships[relnID];
        }
        // Else, create new proxy:
        var newRP = null;
        var jsonReln = $warp.model.getRelationshipByID(relnID);
        if (jsonReln.isAggregation) {
            newRP = new AggregationProxy(jsonReln, this);
        } else {
            newRP = new AssociationProxy(jsonReln, this);
        }
        this.relationships[relnID] = newRP;
        return newRP;
    }

    useData(callback) {
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
                        } else {
                            callback(null);
                        }
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
                                this.viewUrl = result.portalView;
                                callback(this);
                            } else {
                                callback(null);
                            }
                        }.bind(this));
                    break;
                } else {
                    throw new Error("EntityProxy in mode 'editEntity' must have oid!");
                }
            case "addNewEntity":
                this.data = {
                    type: this.type,
                    parentID: this.parentID,
                    parentRelnID: this.relnID,
                    parentRelnName: this.relnName,
                    parentBaseClassID: this.parentBaseClassID,
                    parentBaseClassName: this.parentBaseClassName,
                    embedded: [],
                    associations: []
                };
                this.isDirty = false;
                callback(this);
                break;
            default:
                throw new Error("Invalid mode for entity: '" + this.mode + "'");
        }
    }

    addNewDocument(relationshipID) {
        $warp.save(true);

        this.useData(function(ep) {
            var rd = $warp.model.getRelationshipDetails(relationshipID);
            var targetName = rd.targetJson.name;
            var parentID = ep.data._id;
            var relnID = rd.relnJson.id;
            var relnName = rd.relnJson.name;
            var parentBaseClassName = rd.parentBaseClassJson.name;
            var parentBaseClassID = rd.parentBaseClassJson.id;

            var url = $warp.links.domain.href +
            "/" + targetName +
            "?" + "parentID=" + parentID +
            "&" + "relnID=" + relnID +
            "&" + "relnName=" + relnName +
            "&" + "parentBaseClassName=" + parentBaseClassName +
            "&" + "parentBaseClassID=" + parentBaseClassID;

            window.location.href = url;
        });
    }

    addSibling() {
        $warp.save(true);

        this.useData(function(ep) {
            var relationshipID = ep.data.parentRelnID;
            var rd = $warp.model.getRelationshipDetails(relationshipID);
            var targetName = rd.targetJson.name;
            var parentID = ep.data.parentID;
            var relnID = rd.relnJson.id;
            var relnName = rd.relnJson.name;
            var parentBaseClassName = rd.parentBaseClassJson.name;
            var parentBaseClassID = rd.parentBaseClassJson.id;

            var url = $warp.links.domain.href +
            "/" + targetName +
            "?" + "parentID=" + parentID +
            "&" + "relnID=" + relnID +
            "&" + "relnName=" + relnName +
            "&" + "parentBaseClassName=" + parentBaseClassName +
            "&" + "parentBaseClassID=" + parentBaseClassID;

            window.location.href = url;
        });
    }

    save(ignoreReloadForNewEntities) {
        var reqData;

        if (this.isDocument) {
            if (this.isDirty && !this.data) {
                throw new Error("Can not save 'dirty' entity without data!");
            }

            // The backend-API only supports update of a single document at the moment - TBD!
            switch (this.mode) {
                case "rootInstance":
                    if (!this.data.type) {
                        this.data.type = $warp.domain;
                    }
                    break;
                case "editEntity":
                    if (this.isDirty) {
                        if (this.data._links) {
                            delete this.data._links;
                        }
                        reqData = {
                            commandList: [
                                {
                                    command: "Update",
                                    domain: $warp.domain,
                                    targetType: this.data.type,
                                    entities: [this.data]
                                }
                            ]
                        };
                        $warp.processCRUDcommands(reqData, function(result) {
                            if (result.success) {
                                this.isDirty = false;
                                utils.trace(1, "WarpJSClient.save():\n - Successfully saved " + this.displayName());
                            } else {
                                $warp.alert(result.err);
                            }
                        }.bind(this));
                    }
                    break;
                case "addNewEntity":
                    if (!this.isDirty) {
                        $warp.alert("Can not save new entity: at least one field must be set with new value!");
                    } else {
                        reqData = {
                            commandList: [
                                {
                                    command: "Create",
                                    domain: $warp.domain,
                                    targetType: this.data.type,
                                    entity: this.data
                                }
                            ]
                        };
                        $warp.processCRUDcommands(reqData, function(result) {
                            if (result.success) {
                                this.isDirty = false;
                                this.mode = "editEntity";
                                this.data._id = result.newEntity._id;

                                utils.trace(1, "WarpJSClient.save():\n - Successfully created " + this.displayName());

                                // Re-load after creation?
                                if (!ignoreReloadForNewEntities) {
                                    $warp.openInNewPage(this.data._id, this.type);
                                }
                            } else {
                                $warp.alert(result.err);
                            }
                        }.bind(this));
                    }
                    break;
                default:
                    throw new Error("Mode not supported: " + this.mode);
            }
        }
    }

    getValue(attrName) {
        if (!this.data || this.data[attrName] === null) {
            throw new Error("EntityProxy.getValue(): ERROR - Can not access value '" + attrName + "'");
        }
        utils.trace(2, "EntityProxy.getValue", "Getting value for " + attrName + ": " + this.data[attrName]);
        return this.data[attrName];
    }

    setValue(attrName, val) {
        if (!this.data) {
            throw new Error("EntityProxy.setValue(): ERROR - Can not set value '" + attrName + "'");
        }
        if (!this.data[attrName] && val + "" === "") {
            utils.trace(1, "EntityProxy.setValue", "Ignoring empty fields for new entities!");
            return;
        }
        if (this.data[attrName] !== val) {
            this.data[attrName] = val;
            this.addToHistory(
                {
                    type: "setValue",
                    attribute: attrName,
                    newVal: val
                });
            this.isDirty = true;
            this.getDocumentProxy().isDirty = true;
            utils.trace(1, "EntityProxy.setValue():");
            utils.trace(1,
                "  * Document\n    - Name: " + this.displayName() + "\n    - isDirty: " + this.isDirty +
            "\n    - Changes: " + this.historyToString());
        }
    }

    addToHistory(action) {
    // TBD - move old history entries to separate document if history gets too long
        this.history.push({
            date: new Date(),
            user: $warp.user,
            action: action
        });
    }

    historyToString() {
        var h = "";
        this.history.forEach(function(entry) {
            h += "[" + entry.attribute + "=" + entry.newVal + "]";
        });
        return h;
    }

    displayName() {
        if (!this.data) {
            return this.type + ": No data available";
        }
        if (this.data.path && $warp.tracelevel > 1) {
            return this.data.path;
        }
        if (this.data.Name) {
            return this.data.Name;
        }
        return this.type + "[" + this.data._id + "]";
    }

    getDataViaOID(callback) {
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
        $warp.processCRUDcommands(reqData, function(result) {
            if (result.success) {
                if (!result.resultList || result.resultList.length !== 1) {
                    $warp.alert("Could not find entity!");
                    callback(null);
                    return;
                }
                if (result.resultList[0].error) {
                    $warp.alert("Server error (" + result.resultList[0].status.name + "):" + result.resultList[0].status.message);
                    callback(null);
                    return;
                }
                var resultObj = result.resultList[0];
                if (resultObj && resultObj.matchingEntity) {
                    document.title = resultObj.matchingEntity.Name;
                }
                callback(resultObj);
            } else {
                $warp.alert("Server error:" + result.err);
            }
        });
    }

    getDataViaRootInstance(callback) {
        if (this.data) {
            callback(this);
            return;
        }
        if (!$warp.domain) {
            throw new Error("Can not use root instance without domain!");
        }

        var reqData = {
            commandList: [
                {
                    command: "GetRootInstance",
                    domain: $warp.domain,
                    targetType: $warp.domain
                }
            ]
        };

        $warp.processCRUDcommands(reqData, function(result) {
            if (result.success) {
                if (!result.resultList || result.resultList.length !== 1) {
                    $warp.alert("Could not find RootInstance - potential Server error");
                    return;
                }
                if (result.resultList[0].error) {
                    $warp.alert(result.resultList[0].status);
                    return;
                }
                var rootInstanceFromServer = result.resultList[0].rootInstance;
                callback(rootInstanceFromServer);
            } else {
                $warp.alert(result.err);
            }
        });
    }
}

module.exports = EntityProxy;
