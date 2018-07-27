// const debug = require('debug')('W2:portal:resources/panel');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const panelItemsByPanel = require('./panel-items-by-panel');

module.exports = (persistence, panel, instance) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', {
        type: panel.type,
        id: panel.id,
        name: panel.name,
        description: panel.desc,
        label: panel.label || panel.name,
        style: panel.style
    }))
    .then((resource) => Promise.resolve()
        .then(() => panelItemsByPanel(persistence, panel, instance))
        .then((panelItems) => resource.embed('items', panelItems))

        .then(() => resource)
    )
;
