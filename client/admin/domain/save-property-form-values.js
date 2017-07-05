const warpGlobals = require('./../warp-globals');

module.exports = () => {
    if (warpGlobals.$active.basicProperty) {
        warpGlobals.$active.basicProperty.name = $("#propertyNameI").val();
        warpGlobals.$active.basicProperty.desc = $("#propertyDescI").val();
        warpGlobals.$active.basicProperty.defaultValue = $("#propertyDefaultValueI").val();
        warpGlobals.$active.basicProperty.examples = $("#propertyExamplesI").val();
        warpGlobals.$active.basicProperty.propertyType = $("#propertyTypeI").val();
    }
};
