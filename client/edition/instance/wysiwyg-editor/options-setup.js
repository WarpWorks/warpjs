const openLinkSelectionModal = require('./open-link-selection-modal');

module.exports = ($, instanceDoc, editor) => {
    editor.addButton('linkbutton', {
        text: 'Custom Link',
        icon: false,
        onclick: openLinkSelectionModal.bind(null, $, instanceDoc)
    });
};
