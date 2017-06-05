//
// Class "WarpModelParser"
//

function WarpModelParser(jsonData) {
    this.model = jsonData;
}

WarpModelParser.prototype.getRelationshipDetails = function(relationshipID) {
    var result = {};
    result.relnJson = this.getRelationshipByID(relationshipID);
    result.targetJson = this.getEntityByID(result.relnJson.targetEntity[0]);
    result.parentJson = this.getRelnParentByID(relationshipID);
    result.parentBaseClassJson = this.getBaseClass(result.parentJson);
    return result;
}

WarpModelParser.prototype.getBaseClassByID = function(entityID) {
    return this.getBaseClass(this.getEntityByID(entityID));
}

WarpModelParser.prototype.getBaseClass = function(entity) {
    // BaseClass = Topmost, non-abstract class in the inheritance hierarchy
    if (entity.parentClass && entity.parentClass.length>0) {
        var parent = this.getEntityByID(entity.parentClass[0]);
        if (!parent.isAbstract)
            return this.getBaseClass(parent);
    }
    if (entity.isAbstract)
        return null;
    return entity;
}

WarpModelParser.prototype.getEntityByName = function(entityName) {
    return this.model.entities.find  (function(entity) {
        return entity.name === entityName;
    });
}
WarpModelParser.prototype.getEntityByID = function(entityID) {
    return this.model.entities.find  (function(entity) {
        return entity.id === entityID;
    });
}

WarpModelParser.prototype.getDerivedEntitiesByID = function(entityID, includeAbstractEntities, includeChildrensChildren) {
    var results = [];
    this.model.entities.forEach(function(entity) {
        if (entity.parentClass.length > 0)
            if (entity.parentClass[0] === entityID)
                if (includeAbstractEntities || !entity.isAbstract)
                    results.push(this.getEntityByID(entity.id));
    }.bind(this));
    if (includeChildrensChildren) {
        results.forEach(function (derivedEntity) {
            var childChildren = this.getDerivedEntitiesByID(derivedEntity.id);
            if (childChildren.length > 0)
                results.push(childChildren);
        }.bind(this));
    }
    return results;
}

WarpModelParser.prototype.getPropertyByID = function(propertyID) {
    for (var idx=0; idx<this.model.entities.length; idx++) {
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

