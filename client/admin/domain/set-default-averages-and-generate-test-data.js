const postDomainDataToServer = require('./post-domain-data-to-server');
const restCalls = require('./../rest-calls');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    var avg = 3;
    warpGlobals.$active.domain.setDefaultAverages(avg);
    $("#aggregationTargetAvgI").val(avg);
    postDomainDataToServer();
    restCalls.generateTestData();
};
