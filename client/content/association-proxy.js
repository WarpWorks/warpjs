const AssociationTargetsProxy = require('./association-targets-proxy');
const RelationshipProxy = require('./relationship-proxy');
const utils = require('./../utils');

class AssociationProxy extends RelationshipProxy {
    constructor(jsonReln, parentEntityProxy) {
        super(jsonReln, parentEntityProxy);
        this._assocTargetsProxy = new AssociationTargetsProxy(jsonReln, parentEntityProxy);
    }

    getAssocTargetsProxy() {
        return this._assocTargetsProxy;
    }

    noOfTotalQueryResults() {
        return this.getAssocs().data.length;
    }

    useRelationship(callback) {
        if (!this.requiresUpdate) {
            callback(this);
            return;
        }

        this.parentEntityProxy.useData(function(sourceProxy) {
            var assocs = this.getAssocs();
            this._queryResults = [];
            for (var idx = 0; idx < assocs.data.length; idx++) {
                var target = assocs.data[idx];
                var entityConfig = {
                    type: target.type,
                    isDocument: true,
                    mode: "editEntity",
                    oid: target._id,
                    parentRelnProxy: this
                };
                var proxy = $warp.entityCacheFindOrAddNewEntityProxy(entityConfig);
                this._queryResults.push(proxy);
            }
            this.requiresUpdate = false;
            callback(this);
        }.bind(this));
    }

    addToAssocTargets(id, targetType, desc) {
        if (!this.parentEntityProxy.data) {
            throw new Error("Can not access data for " + this.parentEntityProxy.toString());
        }

        try {
            this.getAssocDataByTargetID(id);
            // Should not work:
            utils.trace(1, "AssociationProxy.addToAssocTargets", "Warning: Can not add same target again (id:" + id + ")");
            return;
        } catch (err) {
            utils.trace(3, "AssociationProxy.addToAssocTargets", "Adding target (id:" + id + ")");
        }

        var assocs = this.getAssocs();
        assocs.data.push(
            {
                _id: id,
                type: targetType,
                desc: desc
            });
        this.parentEntityProxy.isDirty = true;
        this.requiresUpdate = true;
    }

    getAssocs() {
        if (!this.parentEntityProxy.data) {
            throw new Error("Can not access data for " + this.parentEntityProxy.toString());
        }
        if (!this.parentEntityProxy.data.associations) {
            this.parentEntityProxy.data.associations = [];
        }

        var allAssocs = this.parentEntityProxy.data.associations;
        var result = null;
        allAssocs.forEach(function(assocObj) {
            if (assocObj.relnID === this.id) {
                result = assocObj;
            }
        }.bind(this));
        if (!result) {
            result = {
                relnID: this.id,
                relnName: this.name,
                data: []
            };
            // Push, but don't mark as dirty - we can lose this change without problem, if not needed
            this.parentEntityProxy.data.associations.push(result);
            this.requiresUpdate = true;
        }
        return result;
    }

    getAssocDataByTargetID(id) {
        var result = null;
        var assocArray = this.getAssocs().data;
        assocArray.forEach(function(assoc) {
            if (assoc._id === id) {
                result = assoc;
            }
        });
        if (result) {
            return result;
        } else {
            throw new Error("Could not find association target with id=" + id + " in " + this.toString());
        }
    }

    updateAssocDesc(id, desc) {
        var assocArray = this.getAssocs().data;

        var ok = false;
        assocArray.forEach(function(assoc) {
            if (assoc._id === id) {
                ok = true;
                assoc.desc = desc;
            }
        });
        if (!ok) {
            throw new Error("Could not find association target with id=" + id + " in " + this.toString());
        }

        this.parentEntityProxy.isDirty = true;
        this.requiresUpdate = true;
    }

    removeFromAssocTargets(id) {
        if (this.requiresUpdate) {
            throw new Error("Invalid use of 'removeFromAssocTargets()'");
        }

        // Create new array without element 'id'
        var assocArray = this.getAssocs().data;
        var assocArrayNew = [];
        for (var idx in assocArray) {
            if (assocArray[idx]._id !== id) {
                assocArrayNew.push(assocArray[idx]);
            }
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
        if (!ok) {
            throw new Error("Could not remove association from target list!");
        }

        this.requiresUpdate = true;
    }
}

module.exports = AssociationProxy;
