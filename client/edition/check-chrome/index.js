const template = require('./template.hbs');

module.exports = ($) => {
    if (window && window.chrome && window.chrome.webstore) {
        return;
    }

    const div = $(template());
    $('body').append(div);
};
