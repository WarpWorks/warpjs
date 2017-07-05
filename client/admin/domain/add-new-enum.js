const updateActiveEnum = require('./update-active-enum');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Create new Enumeration
    var newEnum = warpGlobals.$active.entity.addNew_Enumeration("New_Enumeration", "");
    newEnum.validEnumSelections = "Exactly One";

    // Now update the active enum
    updateActiveEnum(newEnum.id);

    // Selected "name" text from newly created enum
    $("#enumNameI").focus().select();
};
