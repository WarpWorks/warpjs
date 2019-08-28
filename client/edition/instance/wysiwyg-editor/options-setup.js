const openLinkSelectionModal = require('./open-link-selection-modal');

module.exports = ($, instanceDoc, editor) => {
    var menuItems = [];

    menuItems.push({
        text: 'External URL',
        icon: false,
        onclick: () => editor.buttons.link.onclick(editor),
        stateSelector: 'a[href]',
        context: 'insert',
        prependToContext: true
    });

    menuItems.push({
        text: 'Internal link',
        icon: false,
        onclick: openLinkSelectionModal.bind(null, $, instanceDoc)
    });

    menuItems.push({
        text: 'Glossary item',
        icon: false,
        onclick: openLinkSelectionModal.bind(null, $, instanceDoc, 'GlossaryItem')
    });

    editor.addButton('linkDropdown', {
        type: 'menubutton',
        text: '',
        icon: 'link',
        menu: menuItems
    });

    editor.addMenuItem('linkDropDownMenu', {
        icon: false,
        text: 'link Dropdown',
        menu: menuItems,
        context: 'insert',
        prependToContext: true
    });
};
