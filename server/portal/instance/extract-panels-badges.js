// const debug = require('debug')('W2:portal:instance/extract-panels-badges');
const Promise = require('bluebird');

const constants = require('./../resources/constants');
const panelResource = require('./../resources/panel');

module.exports = (persistence, entity, instance, entityPanels) => Promise.resolve()
    .then(() => entityPanels.filter((panel) => panel.name === constants.PANEL_NAMES.Badges))
    .then((panels) => Promise.map(panels, (panel) => panelResource(persistence, panel, instance)))
;
