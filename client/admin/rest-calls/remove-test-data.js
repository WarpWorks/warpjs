const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Prepare request object
    var reqData = {domainName: warpGlobals.$active.domain.name};
    console.log("removeTestData for: " + reqData.domainName);
    reqData = JSON.stringify(reqData, null, 2);

    // Post to server
    $.ajax({
        url: warpGlobals.$active._links.removeTestData.href,
        type: 'POST',
        data: reqData,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function(result) {
            if (result.success) {
                $("#testAppStatusD").html("<div class='alert alert-info'><strong>OK:</strong> Successfully removed test data</div>");
            } else {
                $("#testAppStatusD").html("<div class='alert alert-danger'><strong>Error:</strong> Failed to remove test data!</div>");
            }
        },
        error: function() {
            console.log("Error while removing test data!");
        }
    });
};
