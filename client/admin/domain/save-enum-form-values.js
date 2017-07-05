const warpGlobals = require('./../warp-globals');

module.exports = () => {
    if (warpGlobals.$active.enumeration) {
        warpGlobals.$active.enumeration.name = $("#enumNameI").val();
        warpGlobals.$active.enumeration.desc = $("#enumDescI").val();
        switch ($("#enumValidSelectionI").val()) {
            // TBD: use proper IDs for validEnumSelections:
            case "Exactly One": warpGlobals.$active.enumeration.validEnumSelections = "Exactly One"; break;
            case "Zero or One": warpGlobals.$active.enumeration.validEnumSelections = "Zero or One"; break;
            case "Zero to Many": warpGlobals.$active.enumeration.validEnumSelections = "Zero to Many"; break;
            case "One to Many": warpGlobals.$active.enumeration.validEnumSelections = "One to Many"; break;
            default: throw new Error("Unknown selection: " + $("#enumValidSelectionI").val());
        }
    }
};
