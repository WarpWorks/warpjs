// const debug = require('debug')('W2:portal:instance/extract-panels-main-body');
const Promise = require('bluebird');

const constants = require('./../resources/constants');
const panelResource = require('./../resources/panel');

module.exports = (persistence, entity, instance, entityPanels, isSpecializedPageViewStyle) => Promise.resolve()
    .then(() => entityPanels.filter((panel) => {
        if (!isSpecializedPageViewStyle) {
            // Take all the panels.
            return true;
        }

        return !constants.isSpecializedPanel(panel.style);
    }))
    .then((panels) => Promise.map(
        panels,
        (panel) => panelResource(persistence, panel, instance)
    ))
;
