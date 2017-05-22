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

WarpModelParser.prototype.getDerivedEntitiesByID = function(entityID) {
    var results = [];
    this.model.entities.forEach(function(entity) {
        if (entity.parentClass.length > 0)
            if (entity.parentClass[0] === entityID)
                results.push(this.getEntityByID(entity.id));
    }.bind(this));
    results.forEach(function(derivedEntity) {
        var childChildren = this.getDerivedEntitiesByID(derivedEntity.id);
        if (childChildren.length > 0)
            results.push (childChildren);
    }.bind(this));

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

