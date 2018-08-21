// const debug = require('debug')('W2:content:inline-edit/resources/page-view');
const Promise = require('bluebird');

const panelResource = require('./panel');

module.exports = (persistence, pageView, instance) => Promise.reduce(
    pageView.getPanels(true),
    (accumulator, panel) => Promise.resolve()
        .then(() => panelResource(persistence, panel, instance))
        .then((items) => items ? accumulator.concat(items) : accumulator)
    ,
    []
);
