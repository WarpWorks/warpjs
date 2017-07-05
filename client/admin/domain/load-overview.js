const restCalls = require('./../rest-calls');
const updateActiveDomain = require('./update-active-domain');
const warpGlobals = require('./../warp-globals');
const WarpWorks = require('./../models/warp-works');

module.exports = (domArg) => {
    var domain = domArg || window.location.pathname.split('/').pop();

    if (domain === "New_Domain") {
        warpGlobals.$active.domain = WarpWorks.get().addNew_Domain("New_Domain", "");
        var rootInstance = warpGlobals.$active.domain.addNew_Entity("MyDomain", "");
        rootInstance.isRootEntity = true;
        rootInstance.isRootInstance = true;

        updateActiveDomain();
    } else {
        restCalls.getDomainData(function() {
            updateActiveDomain();
        });
    }
};
