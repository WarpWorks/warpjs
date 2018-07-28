// const debug = require('debug')('W2:portal:instance/extract-panels-sidebar');
const Promise = require('bluebird');

const constants = require('./../resources/constants');
const panelResource = require('./../resources/panel');

module.exports = (persistence, entity, instance, entityPanels) => Promise.resolve()
    .then(() => entityPanels.filter((panel) => panel.name === constants.PANEL_NAMES.Sidebar))
    .then((panels) => Promise.map(panels, (panel) => panelResource(persistence, panel, instance)))
;
