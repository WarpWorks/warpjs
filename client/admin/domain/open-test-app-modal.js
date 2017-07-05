const postDomainDataToServer = require('./../post-domain-data-to-server');
const restCalls = require('./../rest-calls');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    postDomainDataToServer();
    $("#generateDefaultViewsB").on("click", restCalls.generateDefaultViews);
    $("#generateTestDataB").on("click", restCalls.generateTestData);
    $("#removeTestDataB").on("click", restCalls.removeTestData);
    $("#viewTestAppB").on("click", () => {
        setTimeout(() => {
            window.location.href = warpGlobals.$active._links.WarpJS.href;
        }, 750);
    });

    $("#testAppM").modal();
};
