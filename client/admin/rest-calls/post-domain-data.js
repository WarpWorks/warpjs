const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Prepare request object
    var reqData = {domainData: JSON.stringify(warpGlobals.$active.domain, null, 2), domainName: warpGlobals.$active.domain.name};
    console.log("postDomainData for: " + reqData.domainName);
    // console.log(reqData.domainData);
    reqData = JSON.stringify(reqData, null, 2);

    $.ajax({
        url: warpGlobals.$active._links.self.href,
        method: 'PUT',
        data: reqData,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Accept': 'application/hal+json'
        },
        dataType: "json",
        success: function(result) {
            if (result.success) {
                console.log("Save: OK");
                if (result.warnings) {
                    warpGlobals.$active.warnings = result.status;
                    $("#warningsA").show();
                } else {
                    $("#warningsA").hide();
                }
            } else {
                console.log("Failed to save Domain!");
            }
        },
        error: function() {
            console.log("Error while saving Domain!");
        }
    });
};
