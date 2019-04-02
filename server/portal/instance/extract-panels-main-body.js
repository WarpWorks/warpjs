const Promise = require('bluebird');

const constants = require('./../resources/constants');
// const debug = require('./debug')('extract-panels-main-body');
const panelResource = require('./../resources/panel');

module.exports = async (persistence, entity, instance, entityPanels, isSpecializedPageViewStyle) => {
    const panels = entityPanels.filter((panel) => {
        if (!isSpecializedPageViewStyle) {
            // Take all the panels.
            return true;
        }

        return !constants.isSpecializedPanel(panel.name);
    });

    return Promise.map(
        panels,
        async (panel) => panelResource(persistence, panel, instance)
    );
};
