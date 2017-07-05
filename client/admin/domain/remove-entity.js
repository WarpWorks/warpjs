const updateActiveDomain = require('./update-active-domain');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    warpGlobals.$active.domain.remove_Entity(warpGlobals.$active.entity.id);
    warpGlobals.$active.entity = null;
    updateActiveDomain();
};
