const updateActiveProperty = require('./update-active-property');
const warpGlobals = require('./../warp-globals');

module.exports = () => {
    warpGlobals.$active.entity.remove_BasicProperty(warpGlobals.$active.basicProperty.id);
    warpGlobals.$active.basicProperty = null;
    updateActiveProperty();
};
