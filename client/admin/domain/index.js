const addNewEntity = require('./add-new-entity');
const aggregationAverageChanged = require('./aggregation-average-changed');
const aggregationNameChanged = require('./aggregation-name-changed');
const associationAverageChanged = require('./association-average-changed');
const associationNameChanged = require('./association-name-changed');
const restCalls = require('./../rest-calls');
const entityNameChanged = require('./entity-name-changed');
const enumEditLiterals = require('./enum-edit-literals');
const enumNameChanged = require('./enum-name-changed');
const loadOverview = require('./load-overview');
const makeRootEntity = require('./make-root-entity');
const propertyNameChanged = require('./property-name-changed');
const removeAggregation = require('./remove-aggregation');
const removeAssociation = require('./remove-association');
const removeEntity = require('./remove-entity');
const removeEnum = require('./remove-enum');
const removeProperty = require('./remove-property');
const selectTargetEntityForAggregation = require('./select-target-entity-for-aggregation');
const selectTargetEntityForAssociation = require('./select-target-entity-for-association');
const selectTargetEntityForInheritance = require('./select-target-entity-for-inheritance');
const showWarnings = require('./show-warnings');
const warpGlobals = require('./../warp-globals');

(($) => {
    $(document).ready(() => {
        $('#warningsA').click(showWarnings);
        $('#addEntityA').click(addNewEntity);
        $('#parentEntitySelector').click(selectTargetEntityForInheritance);
        $('#rootEntityMakeRootA').click(makeRootEntity);
        $('#removeEntityB').click(removeEntity);
        $('#removePropertyB').click(removeProperty);
        $('#parentEntityNPitem').click(enumEditLiterals);
        $('#removeEnumB').click(removeEnum);
        $('#aggregationTargetNameItem').click(selectTargetEntityForAggregation);
        $('#removeAggregationB').click(removeAggregation);
        $('#associationTagetIcon').click(selectTargetEntityForAssociation);
        $('#removeAssociationB').click(removeAssociation);
        $('#createDefaultViewsB').click(restCalls.createDefaultViews);
        $('#entityNameI').change(entityNameChanged);
        $('#propertyNameI').change(propertyNameChanged);
        $('#enumNameI').change(enumNameChanged);
        $('#aggregationNameI').change(aggregationNameChanged);
        $('#aggregationTargetAvgI').change(aggregationAverageChanged);
        $('#associationNameI').change(associationNameChanged);
        $('#associationTargetAvgI').change(associationAverageChanged);

        $.ajax({
            method: 'GET',
            headers: {
                accept: 'application/hal+json'
            },
            success: function(result) {
                warpGlobals.$active.domain = result.domain;
                warpGlobals.$active._links = result._links;
                loadOverview();
            },
            error: function(err) {
                console.log("INITIAL: err=", err);
            }
        });
    });
})(jQuery);
