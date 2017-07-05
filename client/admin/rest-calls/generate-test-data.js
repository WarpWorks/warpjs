const createModal = require('./../create-modal');
const quantityStructure = require('./../domain/quantity-structure');
const setDefaultAveragesAndGenerateTestData = require('./../domain/set-default-averages-and-generate-test-data');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Update quantity data
    var cnt = warpGlobals.$active.domain.updateQuantityData();

    var callbacks = [
        { close: true, label: "Edit Quantity Structure", callback: quantityStructure },
        { close: true, label: "Set all averages to '3'", callback: setDefaultAveragesAndGenerateTestData },
        { close: true, label: "Cancel" }
    ];
    if (cnt < 2) {
        createModal("Warning", "Quantity Structure is not properly defined. Please go to the 'Quantity Structure' menu and select meaningful values before generating test data! Or select 'Set all averages' to automatically create 3 instances of each Entity type.", "warning", callbacks);
        return;
    }

    // Prepare request object
    var reqData = {domainName: warpGlobals.$active.domain.name};
    console.log("generateTestData for: " + reqData.domainName);
    reqData = JSON.stringify(reqData, null, 2);

    // Post to server
    $.ajax({
        url: warpGlobals.$active._links.generateTestData.href,
        type: 'POST',
        data: reqData,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function(result) {
            if (result.success) {
                $("#testAppStatusD").html("<div class='alert alert-info'><strong>OK:</strong> Successfully started generation of test data (" + cnt + " entities)</div>");
            } else {
                $("#testAppStatusD").html("<div class='alert alert-danger'><strong>Error:</strong> Failed to generate test data!</div>");
            }
        },
        error: function() {
            console.log("Error while generate test data!");
        }
    });
};
