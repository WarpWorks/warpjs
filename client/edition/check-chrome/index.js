const { detect } = require('detect-browser');

const template = require('./template.hbs');

module.exports = ($) => {
    const browser = detect();

    if (browser.name === 'chrome') {
        return;
    }

    const div = $(template());
    $('body').append(div);
};
