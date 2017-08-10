const documentReady = require('./../document-ready');
const template = require('./template.hbs');
const postRender = require('./post-render');

documentReady(jQuery, template, postRender);
