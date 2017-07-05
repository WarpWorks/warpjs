const updateMyNavBar = require('./update-my-nav-bar');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    warpGlobals.$active.domain.name = $("#domainNameI").val();
    warpGlobals.$active.domain.desc = $("#domainDescI").val();
    warpGlobals.$active.domain.definitionOfMany = $("#domainDefOfManyI").val();

    // Update domain name
    updateMyNavBar();
};
