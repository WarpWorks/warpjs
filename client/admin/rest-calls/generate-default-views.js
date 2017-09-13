const Promise = require('bluebird');

const loadDomainOverview = require('./../domain/load-overview');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Prepare request object
    var reqData = {domainName: warpGlobals.$active.domain.name};
    console.log("generateDefaultViews for: " + reqData.domainName);
    reqData = JSON.stringify(reqData, null, 2);

    // Post to server
    const ajaxOptions = {
        url: warpGlobals.$active._links.generateDefaultViews.href,
        type: 'POST',
        data: reqData,
        contentType: 'application/json; charset=utf-8',
        dataType: "json"
    };

    return Promise.resolve()
        .then(() => $.ajax(ajaxOptions))
        .then((result) => {
            loadDomainOverview(); // Re-load model, since it was extended on the server side!
            if (result.success) {
                $("#testAppStatusD").html("<div class='alert alert-info'><strong>OK:</strong> Successfully generated Default Views</div>");
            } else {
                $("#testAppStatusD").html("<div class='alert alert-danger'><strong>Error:</strong> Failed to generated default views!</div>");
            }
        })
        .catch(() => {
            console.log("Error while generating default views!");
        });
};
