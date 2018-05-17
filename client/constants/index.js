const popoverTemplateWithFooter = require('./popover-template-with-footer.hbs');

const constants = {
    HAS_POPOVER: 'warpjs-element-has-popover',
    TEMPLATES: {
        POPOVER_WITH_FOOTER: popoverTemplateWithFooter
    }
};

Object.freeze(constants);

module.exports = constants;
