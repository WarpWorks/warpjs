const domainCancelEvent = require('./domain-cancel-event');
const domainDeleteEvent = require('./domain-delete-event');
const layout = require('./../layout');
const postDomainDataToServer = require('./post-domain-data-to-server');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    var ddMenu = [
        ["Domain Details", "openDomainOverviewModal()"],
        ["Entity Graph", "entityGraph()"],
        ["Quantity Structure", "quantityStructure()"]
    ];

    layout.updateNavBar(
        ["Domain: " + warpGlobals.$active.domain.name, "#"],
        ddMenu,
        "openTestAppModal()",
        postDomainDataToServer, domainCancelEvent, domainDeleteEvent);
};
