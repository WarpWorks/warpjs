const Promise = require('bluebird');

const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Prepare request object
    var reqData = {domainName: warpGlobals.$active.domain.name};
    console.log("removeTestData for: " + reqData.domainName);
    reqData = JSON.stringify(reqData, null, 2);

    const ajaxOptions = {
        url: warpGlobals.$active._links.removeTestData.href,
        type: 'POST',
        data: reqData,
        contentType: 'application/json; charset=utf-8',
        dataType: "json"
    };

    // Post to server
    return Promise.resolve()
        .then(() => $.ajax(ajaxOptions))
        .then((result) => {
            if (result.success) {
                $("#testAppStatusD").html("<div class='alert alert-info'><strong>OK:</strong> Successfully removed test data</div>");
            } else {
                $("#testAppStatusD").html("<div class='alert alert-danger'><strong>Error:</strong> Failed to remove test data!</div>");
            }
        })
        .catch(() => {
            console.log("Error while removing test data!");
        });
};
