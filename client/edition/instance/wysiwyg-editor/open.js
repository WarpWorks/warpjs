const _ = require('lodash');
const Promise = require('bluebird');
const tinymce = require('tinymce');
require('tinymce/themes/modern/theme');

const cache = require('./cache');
const constants = require('./constants');
const options = require('./options');
const template = require('./template.hbs');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="open-wysiwyg"]', function() {
        const input = $(this).parent().children('input');
        // Checking both as this is weird that jQuery converts it.
        const canEdit = $(this).data('warpjsCanEdit') === true || $(this).data('warpjsCanEdit') === 'true';

        cache.input = input;

        return Promise.resolve()
            .then(() => {
                if (!$(`.${constants.MODAL_CLASS}`).length) {
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
            .then(() => $(`.${constants.MODAL_CLASS}`).modal('show'))
            .catch((err) => {
                console.error("error tinymce.init()...", err);
            });
    });
};
