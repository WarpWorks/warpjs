const RelationshipProxy = require('./relationship-proxy');
const utils = require('./../utils');

class AggregationProxy extends RelationshipProxy {
    // constructor(jsonReln, parentEntityProxy) {
    //     super(jsonReln, parentEntityProxy);
    // }

    useRelationship(callback) {
        if (!this.requiresUpdate) {
            utils.trace(2, "AggregationProxy.useRelationship", "Re-using data for " + this.jsonReln.name);
            callback(this);
            return;
        }

        var parentEntity = this.getParentEntity();

        if (parentEntity.mode === "addNewEntity") {
            utils.trace(2, "AggregationProxy.useRelationship", "Creating empty aggregation for new parent entity" + this.jsonReln.name);
            this._queryResultsCount = 0;
            this.selectedEntityIdx = -1;
            this.requiresUpdate = false;
            callback(this);
            return;
        }

        utils.trace(2, "AggregationProxy.useRelationship", "Loading Relationship data for " + this.jsonReln.name);

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
            parentEntity.useData(function(parentEntity) {
                if (parentEntity) {
                    command.parentID = parentEntity.getValue('_id');
                    var reqData = {commandList: []};
                    reqData.commandList.push(command);
                    $warp.processCRUDcommands(reqData, function(result) {
                        if (result.success) {
                            var entityDocs = result.resultList[0].queryResult;
                            this._queryResultsCount = result.resultList[0].noOfTotalQueryResults;
                            this._queryResults = [];
                            entityDocs.forEach(function(entityDoc) {
                                var entityConfig = {
                                    type: entityDoc.type,
                                    isDocument: this.targetIsDocument,
                                    mode: "editEntity",
                                    oid: entityDoc._id,
                                    data: entityDoc,
                                    parentRelnProxy: this
                                };
                                var proxy = $warp.entityCacheFindOrAddNewEntityProxy(entityConfig);
                                this._queryResults.push(proxy);
                            }.bind(this));
                            this.requiresUpdate = false;
                            this.ensureSelectedEntityIdxIsValid();
                            utils.trace(1, "AggregationProxy.useRelationship", "Document: AggregationQuery for " + result.resultList[0].parentRelnName + " (found:" + this.noOfTotalQueryResults() + ")");
                            callback(this);
                        } else {
                            utils.trace(1, "AggregationProxy.useRelationship():\n-  Warning - could not execute AggregationQuery");
                        }
                    }.bind(this));
                } else {
                    utils.trace(1, "AggregationProxy.useRelationship():\n-  Warning - can not use relationship - parentEntity not found!");
                }
            }.bind(this));
        } else {
            // Embedded entity
            this.getParentEntity().useData(function(entity) {
                var embeddedReln = null;
                if (entity.data.embedded) {
                    entity.data.embedded.forEach(function(e) {
                        if (e.parentRelnID === this.jsonReln.id) {
                            embeddedReln = e;
                        }
                    }.bind(this));
                }

                this._queryResults = [];
                this.requiresUpdate = false;
                if (embeddedReln) {
                    this._queryResultsCount = embeddedReln.entities.length;
                    embeddedReln.entities.forEach(function(entityDoc) {
                        var entityConfig = {
                            type: entityDoc.type,
                            isDocument: this.targetIsDocument,
                            mode: "editEntity",
                            oid: entityDoc._id,
                            data: entityDoc,
                            parentRelnProxy: this
                        };
                        var proxy = $warp.entityCacheFindOrAddNewEntityProxy(entityConfig);
                        this._queryResults.push(proxy);
                    }.bind(this));
                    this.ensureSelectedEntityIdxIsValid();
                } else {
                    this._queryResultsCount = 0;
                    this.selectedEntityIdx = -1;
                }
                // var desc = entity.path ? entity.path : entity.displayName();
                utils.trace(1, "AggregationProxy.useRelationship", "Embedded Entity: AggregationQuery for " + this.jsonReln.name + " (found:" + this.noOfTotalQueryResults() + ")");
                callback(this);
            }.bind(this));
        }
    }
}

module.exports = AggregationProxy;
