const Promise = require('bluebird');

const loadDomainOverview = require('./../domain/load-overview');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    // Prepare request object
    var reqData = {domainName: warpGlobals.$active.domain.name};
    console.log("createDefaultViews for: " + reqData.domainName);
    reqData = JSON.stringify(reqData, null, 2);

    // Post to server
    const ajaxOptions = {
        url: warpGlobals.$active._links.createDefaultViews.href,
        method: 'POST',
        data: reqData,
        contentType: 'application/json; charset=utf-8',
        dataType: "json"
    };

    return Promise.resolve()
        .then(() => $.ajax(ajaxOptions))
        .then((result) => {
            loadDomainOverview(); // Re-load model, since it was extended on the server side!
            if (result.success) {
                console.log("Successfully generated Default Views");
            } else {
                console.log("Failure generating Default Views!");
            }
        })
        .catch(() => {
            console.log("Error while generating default views!");
        });
};
