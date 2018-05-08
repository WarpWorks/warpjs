const actionPluginListeners = require('./action-plugin-listeners');
const documentReady = require('./../document-ready');
const postRender = require('./post-render');
const template = require('./template.hbs');

actionPluginListeners($);
documentReady(jQuery, template, postRender);
