const addNewEnum = require('./add-new-enum');
const saveEnumFormValues = require('./save-enum-form-values');
const updateActiveEnum = require('./update-active-enum');
const utils = require('./../utils');
const warpGlobals = require('./../warp-globals');

module.exports = (argActiveEnumID) => {
    // Sorted enum list
    var sortedEnumList = warpGlobals.$active.entity.getEnums(true);

    // Which ID for the active enum (if any)?
    var firstEnum = sortedEnumList.length > 0 ? sortedEnumList[0].id : null;
    var activeEnumID = argActiveEnumID || firstEnum;

    // Save form values
    saveEnumFormValues();

    // Update enum list
    $("#enumsNP").empty();
    if (sortedEnumList.length > 0) {
        sortedEnumList.forEach(function(enumeration, i) {
            var active = utils.compareIDs(enumeration.id, activeEnumID) ? " class='active'" : "";
            var elem = $("<li" + active + "><a href='#' id='" + enumeration.id + "'data-toggle='tab'>" + enumeration.name + "</a></li>");
            $("#enumsNP").append(elem).append(" ");
            elem.click(function(event) {
                updateActiveEnum(event.target.id);
            });
        });
        $("#enumDetailsF").show();
    } else {
        $("#enumDetailsF").hide();
    }

    // Add "new enum" button
    var elem = $("<li><a href='#' id='addEnumA' data-toggle='tab'><span class='glyphicon glyphicon-plus-sign'></span></a></li>");
    $("#enumsNP").append(elem);
    elem.click(addNewEnum);

    // Set active enum, either using argument provided, or first element (if there is one):
    if (activeEnumID) {
        var enumeration = warpGlobals.$active.domain.findElementByID(activeEnumID);
        if (!enumeration) {
            alert("Invalid Enumeration ID: " + activeEnumID);
            return;
        }
        if (enumeration.type !== "Enumeration") {
            alert("Invalid type: " + enumeration.type + " (required: Enumeration");
            return;
        }

        // Set new active enum
        warpGlobals.$active.enumeration = enumeration;

        // Set form values with data from active enum
        var selection = enumeration.validEnumSelections ? enumeration.validEnumSelections : "Exactly One";
        $("#enumValidSelectionI").val(selection);
        $("#enumNameI").val(enumeration.name);
        $("#enumDescI").val(enumeration.desc);
        $("#enumLiteralsI").val(enumeration.toString());
        $("#removeEnumB").html(enumeration.name + " <span class='glyphicon glyphicon-remove-sign'></span>");
    }
};
