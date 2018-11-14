const tinymce = require('tinymce'); require('tinymce/themes/modern/theme');
const TEXT_SELECTOR = '#warpjs-inline-edit-content';

// const openLinkSelectionModal = require('./../../edition/instance/wysiwyg-editor/open-link-selection-modal');
const optionsSetup = require('./../../edition/instance/wysiwyg-editor/options-setup');

module.exports = ($, modal, clickedElement) => {
    // Bug in tinymce
    $(document).on('focusin', (e) => {
        if ($(e.target).closest('.mce-window').length) {
            e.stopImmediatePropagation();
        }
    });

    if (tinymce.editors.length) {
        tinymce.editors[0].remove();
    }

    const instanceDoc = $('[data-warpjs-status="instance"]');

    tinymce.init({
        height: 100,
        selector: TEXT_SELECTOR,
        menubar: false,
        elementpath: false,
        anchor_top: false,
        anchor_bottom: false,
        force_br_newlines: false,
        force_p_newlines: false,
        forced_root_block: '',
        paste_as_text: true,
        extended_valid_elements: 'span[!class]',
        plugins: 'lists link paste table',
        toolbar: 'warpjsSave bold italic numlist bullist link linkbutton | table',
        setup(editor) {
            optionsSetup($, instanceDoc, editor);

            editor.addButton('warpjsSave', {
                title: 'Save changes to server',
                text: 'Save',
                icon: false,
                onclick: () => {
                    $(TEXT_SELECTOR, modal).val(editor.getContent()).trigger('change');
                }
            });

            editor.on('blur', function(event) {
                $(TEXT_SELECTOR, modal).val(editor.getContent()).trigger('change');
            });
        },
        content_css: '//www.tinymce.com/css/codepen.min.css'
    });
};
