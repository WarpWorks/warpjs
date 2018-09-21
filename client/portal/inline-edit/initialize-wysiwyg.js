const tinymce = require('tinymce'); require('tinymce/themes/modern/theme');

const TEXT_SELECTOR = '#warpjs-inline-edit-content';

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

    tinymce.init({
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
            editor.addButton('linkbutton', {
                text: 'Custom Link',
                icon: false,
                onclick: () => window.WarpJS.toast.warning($, "Implement Custom Link clicked", "TODO")
            });

            editor.addButton('warpjsSave', {
                title: 'Save changes to server',
                text: 'Save',
                icon: false,
                onclick: () => {
                    $(TEXT_SELECTOR, modal).val(editor.getContent()).trigger('change');
                }
            });
        },
        content_css: '//www.tinymce.com/css/codepen.min.css'
    });
};
