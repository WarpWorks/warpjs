const updateActiveProperty = require('./update-active-property');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Create new Property
    var newProperty = warpGlobals.$active.entity.addNew_BasicProperty("New_Property", "");
    newProperty.propertyType = "string";

    // Now update the active property
    updateActiveProperty(newProperty.id);

    // Selected "name" text from newly created property
    $("#propertyNameI").focus().select();
};
