const documentReady = require('./../document-ready');
const postRender = require('./post-render');
const template = require('./template.hbs');

documentReady(jQuery, template, postRender);
