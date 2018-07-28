const _ = require('lodash');
// const debug = require('debug')('W2:portal:resources/separator-panel-item');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const basePanelItemInfo = require('./base-panel-item-info');

module.exports = (persistence, panelItem, instance) => Promise.resolve()
    // .then(() => debug(panelItem))
    .then(() => basePanelItemInfo(panelItem))
    .then((basePanelItemInfo) => _.extend({}, basePanelItemInfo, {
    }))
    .then((resourceInfo) => warpjsUtils.createResource('', resourceInfo))
    .then((resource) => Promise.resolve()
        .then(() => resource)
    )
;
