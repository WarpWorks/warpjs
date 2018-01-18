const _ = require('lodash');
const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const formResource = require('./index');

module.exports = (persistence, entity, instance, docLevel, relativeToDocument) => Promise.resolve()
    .then(() => warpjsUtils.createResource('', _.extend({}, entity.toFormResourceBase(), {
        docLevel: docLevel.join('.')
    })))
    .then((resource) => Promise.resolve()
        .then(() => entity.getPanels())
        .then((panels) => Promise.map(
            panels,
            (panel) => formResource(persistence, panel, instance, docLevel, relativeToDocument)
        ))
        .then((panels) => panels.sort(warpjsUtils.byPositionThenName))
        .then((panels) => {
            resource.multiPanels = (panels.length > 1);
            resource.panels = panels; // TODO: embed
        })

        .then(() => resource)
    )
;
