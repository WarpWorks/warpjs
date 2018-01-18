const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const formResource = require('./index');

module.exports = (persistence, entity, instance, docLevel, relativeToDocument) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', _.extend({}, entity.toFormResourceBase(), {
        docLevel: docLevel.join('.')
    })))
    .then((resource) => Promise.resolve()
        // Panel items.
        .then(() => entity.getPanelItems())
        .then((panelItems) => Promise.map(
            panelItems,
            (panelItem) => formResource(persistence, panelItem, instance, docLevel, relativeToDocument)
        ))
        .then((panelItems) => resource.embed('items', panelItems))

        // actions
        .then(() => entity.actions)
        .then((actions) => Promise.map(
            actions,
            (action) => formResource(persistence, action, instance, docLevel, relativeToDocument)
        ))
        .then((actions) => resource.embed('actions', actions))

        .then(() => resource)
    )
;
