// const debug = require('debug')('W2:content:inline-edit/resources/panel');
const Promise = require('bluebird');

const panelItemResource = require('./panel-item');

module.exports = (persistence, panel, instance) => Promise.reduce(
    panel.getPanelItems(),
    (accumulator, panelItem) => Promise.resolve()
        .then(() => panelItemResource(persistence, panelItem, instance))
        .then((items) => items ? accumulator.concat(items) : accumulator)
    ,
    []
);
