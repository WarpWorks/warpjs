const extend = require('lodash/extend');
const warpjsUtils = require('@warp-works/warpjs-utils');

const basePanelItemInfo = require('./base-panel-item-info');
// const debug = require('./debug')('separator-panel-item');

module.exports = async (persistence, panelItem, instance) => {
    // .then(() => debug(panelItem))
    const panelItemInfo = await basePanelItemInfo(panelItem);
    const resourceInfo = extend({}, panelItemInfo, {
        showItem: true
    });
    const resource = warpjsUtils.createResource('', resourceInfo);
    return resource;
};
