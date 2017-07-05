const postDomainDataToServer = require('./../post-domain-data-to-server');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    postDomainDataToServer();
    window.location.href = warpGlobals.$active._links.entityGraph.href;
};
