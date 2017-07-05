const saveDomainOverviewFormData = require('./save-domain-overview-form-data');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    $("#domainDetailsM").modal();
    $("#domainNameI").val(warpGlobals.$active.domain.name);
    $("#domainDescI").val(warpGlobals.$active.domain.desc);
    $("#domainDefOfManyI").val(warpGlobals.$active.domain.definitionOfMany);
    $("#saveDomainOververviewB").on("click", saveDomainOverviewFormData);
};
