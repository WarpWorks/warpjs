const warpjsUtils = require('@warp-works/warpjs-utils');

const addNewAssociation = require('./add-new-association');
const saveAssociationFormValues = require('./save-association-form-values');
const updateActiveAssociation = require('./update-active-association');
const warpGlobals = require('./../warp-globals');

module.exports = (argActiveAssociationID) => {
    // Save current association data
    saveAssociationFormValues();

    // Which ID for the active association (if any)?
    var assocs = warpGlobals.$active.entity.getAssociations(true);
    var firstAssoc = assocs.length > 0 ? assocs[0].id : null;
    var activeAssociationID = argActiveAssociationID || firstAssoc;

    // Update association list
    $("#associationNP").empty();
    if (assocs.length > 0) {
        assocs.forEach(function(association, i) {
            var active = warpjsUtils.compareIDs(association.id, activeAssociationID) ? " class='active'" : "";
            var elem = $("<li" + active + "><a href='#' id='" + association.id + "'data-toggle='tab'>" + association.name + "</a></li>");
            $("#associationNP").append(elem).append(" ");
            elem.click(function(event) {
                updateActiveAssociation(event.target.id);
            });
        });
        $("#associationDetailsF").show();
    } else {
        $("#associationDetailsF").hide();
    }

    // Append "new association" button to the end
    var elem = $("<li><a href='#' id='addAssociationA' data-toggle='tab'><span class='glyphicon glyphicon-plus-sign'></span></a></li>");
    $("#associationNP").append(elem);
    elem.click(addNewAssociation);

    // Populate form, if there is an active association
    if (activeAssociationID) {
        var association = warpGlobals.$active.domain.findElementByID(activeAssociationID);
        if (!association) {
            alert("Invalid Relationship ID: " + activeAssociationID);
            return;
        }
        if (association.type !== "Relationship") {
            alert("Invalid type: " + association.type + " (required: Relationship");
            return;
        }

        // Set new active association
        warpGlobals.$active.association = association;

        // Set form values with data from active assoc
        $("#associationNameI").val(association.name);
        $("#associationDescI").val(association.desc);
        $("#removeAssociationB").html(association.name + " <span class='glyphicon glyphicon-remove-sign'></span>");
        if (association.hasTargetEntity()) {
            $("#associationTargetNameA").text(association.getTargetEntity().name);
        } else {
            $("#associationTargetNameA").text("undefined");
        }
        $("#associationTargetAvgI").val(association.targetAverage);
        $("#associationTargetMinI").val(association.targetMin);
        $("#associationTargetMaxI").val(association.targetMax);
    }
};
