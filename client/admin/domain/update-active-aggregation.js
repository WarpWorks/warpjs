const warpjsUtils = require('@warp-works/warpjs-utils');

const addNewAggregation = require('./add-new-aggregation');
const saveAggregationFormValues = require('./save-aggregation-form-values');
const updateActiveAggregation = require('./update-active-aggregation');
const warpGlobals = require('./../warp-globals');

module.exports = (argActiveAggregationID) => {
    // Save aggregation form data
    saveAggregationFormValues();

    // Which ID for the active aggregation (if any)?
    var aggs = warpGlobals.$active.entity.getAggregations(true);
    var firstAgg = aggs.length > 0 ? aggs[0].id : null;
    var activeAggregationID = argActiveAggregationID || firstAgg;

    // Update aggregation list
    $("#aggregationNP").empty();
    if (aggs.length > 0) {
        aggs.forEach(function(aggregation, i) {
            var active = warpjsUtils.compareIDs(aggregation.id, activeAggregationID) ? " class='active'" : "";
            var elem = $("<li" + active + "><a href='#' id='" + aggregation.id + "'data-toggle='tab'>" + aggregation.name + "</a></li>");
            $("#aggregationNP").append(elem).append(" ");
            elem.click(function(event) {
                updateActiveAggregation(event.target.id);
            });
        });
        $("#aggregationDetailsF").show();
    } else {
        $("#aggregationDetailsF").hide();
    }

    // Append "new aggregation" button to the end
    var elem = $("<li><a href='#' id='addAggregationA' data-toggle='tab'><span class='glyphicon glyphicon-plus-sign'></span></a></li>");
    $("#aggregationNP").append(elem);
    elem.click(addNewAggregation);

    // Populate form, if active aggregation is given
    if (activeAggregationID) {
        // Find active aggregation
        var aggregation = warpGlobals.$active.domain.findElementByID(activeAggregationID);
        if (!aggregation) {
            alert("Invalid Relationship ID: " + activeAggregationID);
            return;
        }
        if (aggregation.type !== "Relationship") {
            alert("Invalid type: " + aggregation.type + " (required: Relationship");
            return;
        }

        // Set new active aggregation
        warpGlobals.$active.aggregation = aggregation;

        // Set form values with data from active aggregation
        $("#aggregationNameI").val(aggregation.name);
        $("#aggregationDescI").val(aggregation.desc);
        $("#removeAggregationB").html(aggregation.name + " <span class='glyphicon glyphicon-remove-sign'></span>");
        if (aggregation.hasTargetEntity()) {
            $("#aggregationTargetNameA").text(aggregation.getTargetEntity().name);
        } else {
            $("#aggregationTargetNameA").text("undefined");
        }
        $("#aggregationTargetAvgI").val(aggregation.targetAverage);
        $("#aggregationTargetMinI").val(aggregation.targetMin);
        $("#aggregationTargetMaxI").val(aggregation.targetMax);
    }
};
