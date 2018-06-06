const _ = require('lodash');
const Promise = require('bluebird');
const tinymce = require('tinymce');
require('tinymce/themes/modern/theme');

const cache = require('./cache');
const constants = require('./constants');
const options = require('./options');
const template = require('./template.hbs');

function openModal($, instanceDoc, element) {
    const input = $(element).parent().children('textarea');
    // Checking both as this is weird that jQuery converts it.
    const canEdit = $(element).data('warpjsCanEdit') === true || $(element).data('warpjsCanEdit') === 'true';

    cache.input = input;

    Promise.resolve()
        .then(() => {
            if (!$(constants.MODAL_SELECTOR, instanceDoc).length) {
                const content = template(_.extend({}, constants, {
                    canEdit
                }));
                instanceDoc.append(content);
            }
        })
        .then(() => {
            if (!tinymce.editors.length) {
                return tinymce.init(options($, instanceDoc, canEdit));
            }
        })
        .then(() => tinymce.activeEditor.setContent(input.val()))
        .then(() => $(constants.MODAL_SELECTOR, instanceDoc).modal('show'))
        .catch((err) => {
            console.error("error tinymce.init()...", err);
        });
}

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', constants.OPEN_MODAL_SELECTOR, function() {
        openModal($, instanceDoc, this);
    });

    instanceDoc.on('click', 'textarea', function() {
        openModal($, instanceDoc, this);
    });
};
