const saveEntityFormValues = require('./save-entity-form-values');
const updateActiveAggregation = require('./update-active-aggregation');
const updateActiveAssociation = require('./update-active-association');
const updateActiveEnum = require('./update-active-enum');
const updateActiveProperty = require('./update-active-property');
const updateViewLists = require('./update-view-lists');
const warpGlobals = require('./../warp-globals');

module.exports = (entityID) => {
    // Show form (is hidden only in case domain has no entities)
    $("#entityPanelBodyD").show();

    // Find active entity
    var entity = warpGlobals.$active.domain.findElementByID(entityID);
    if (!entity) {
        alert("Invalid Entity ID: " + entityID);
        return;
    }
    if (entity.type !== "Entity") {
        alert("Invalid type: " + entity.type + " (required: Entity)");
        return;
    }

    // Save currently active entity (and all child values), then set new active entity
    saveEntityFormValues();
    warpGlobals.$active.entity = entity;

    // Set panel heading
    $("#entityPanelHeadingD").text("Entity: " + (entity.isRootInstance ? "#" : "") + (entity.isAbstract ? "%" : "") + entity.name);

    //
    // Basics
    //

    $("#entityNameI").val(entity.name);
    $("#entityDescI").val(entity.desc);
    $("#entityTypeI").val(entity.entityType);
    $("#removeEntityB").html(entity.name + " <span class='glyphicon glyphicon-remove-sign'></span>");

    if (entity.isRootInstance) {
        $("#removeEntityB").hide();
        $("#entityTypeFG").hide();
        $("#parentEntityFG").hide();
        $("#rootEntityFG").hide();
    } else {
        // Show 'remove' button
        $("#removeEntityB").show();

        // Update and show info on parent class
        if (entity.hasParentClass()) {
            $("#parentEntityNameA").text(entity.getParentClass().name);
        } else {
            $("#parentEntityNameA").text("undefined");
        }
        $("#entityTypeFG").show();
        $("#parentEntityFG").show();

        // Update and show info on root entity status
        if (entity.isRootEntity) {
            $("#rootEntityStatusA").text("Yes");
            $("#rootEntityMakeRootA").hide();
        } else {
            $("#rootEntityStatusA").text("No");
            $("#rootEntityMakeRootA").show();
        }
        $("#rootEntityFG").show();
    }

    //
    // Update Properties, Aggregations, Associations and Views
    //

    updateActiveProperty();
    updateActiveEnum();
    updateActiveAggregation();
    updateActiveAssociation();
    updateViewLists();
};
