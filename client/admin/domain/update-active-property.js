const addNewProperty = require('./add-new-property');
const savePropertyFormValues = require('./save-property-form-values');
const updateActiveProperty = require('./update-active-property');
const utils = require('./../utils');
const warpGlobals = require('./../warp-globals');

module.exports = (argActivePropertyID) => {
    // Sorted property list
    var sortedPropertyList = warpGlobals.$active.entity.getBasicProperties(true);

    // Which ID for the active property (if any)?
    var firstProperty = sortedPropertyList.length > 0 ? sortedPropertyList[0].id : null;
    var activePropertyID = argActivePropertyID || firstProperty;

    // Save form values
    savePropertyFormValues();

    // Update property list
    $("#propertiesNP").empty();
    if (sortedPropertyList.length > 0) {
        sortedPropertyList.forEach(function(property, i) {
            var active = utils.compareIDs(property.id, activePropertyID) ? " class='active'" : "";
            var elem = $("<li" + active + "><a href='#' id='" + property.id + "' data-toggle='tab'>" + property.name + "</a></li>");
            $("#propertiesNP").append(elem).append(" ");
            elem.click(function(event) {
                updateActiveProperty(event.target.id);
            });
        });
        $("#propertyDetailsF").show();
    } else {
        $("#propertyDetailsF").hide();
    }

    // Add "new property" button
    var elem = $("<li><a href='#' id='addPropertyA' data-toggle='tab'><span class='glyphicon glyphicon-plus-sign'></span></a></li>");
    $("#propertiesNP").append(elem);
    elem.click(addNewProperty);

    // Set active property, either using argument provided, or first element (if there is one):
    if (activePropertyID) {
        var property = warpGlobals.$active.domain.findElementByID(activePropertyID);
        if (!property) {
            alert("Invalid Property ID: " + activePropertyID);
            alert("Invalid Property ID: " + activePropertyID);
            return;
        }
        if (property.type !== "BasicProperty") {
            alert("Invalid type: " + property.type + " (required: BasicProperty");
            return;
        }

        // Set new active property
        warpGlobals.$active.basicProperty = property;

        // Set form values with data from active property
        $("#propertyNameI").val(property.name);
        $("#propertyDescI").val(property.desc);
        $("#propertyDefaultValueI").val(property.defaultValue);
        $("#propertyExamplesI").val(property.examples);
        $("#propertyTypeI").val(property.propertyType);
        $("#removePropertyB").html(property.name + " <span class='glyphicon glyphicon-remove-sign'></span>");
    }
};
