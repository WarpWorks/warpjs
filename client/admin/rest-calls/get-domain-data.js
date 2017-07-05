const warpGlobals = require('./../warp-globals');
const Domain = require('./../models/domain');

module.exports = (afterLoad) => {
    var domain = window.location.pathname.split('/').pop();

    $.ajax({
        url: warpGlobals.$active._links.W2domain.href,
        method: 'GET',
        headers: {
            contentType: 'application/json; charset=utf-8',
            accept: 'application/hal+json'
        },
        success: function(result) {
            if (result.success) {
                warpGlobals.$active = {}; // Remove old settings
                warpGlobals.$active.domain = Domain.fromJSON(result.domain);
                warpGlobals.$active._links = result._links;

                console.log("Loaded: " + warpGlobals.$active.domain.name);
                if (afterLoad) {
                    afterLoad();
                }
            } else {
                alert(result.err);
            }
        },
        error: function(result) {
            alert("GET: Error - could not load domain: " + domain);
        }
    });
};
