const template = require('./template.hbs');

module.exports = ($) => {
    if (window
            && window.chrome
            && (window.chrome.webstore || window.chrome.runtime)
            ) {
        return;
    }

    const div = $(template());
    $('body').append(div);
};
