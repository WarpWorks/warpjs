const template = require('./template.hbs');
const contentTemplate = require('./content.hbs');

let modal;

function show($, percent) {
    if (!modal) {
        modal = $(template());
    }
    modal.html(contentTemplate({percent}));
    modal.modal('show');
}

function hide() {
    if (modal) {
        modal.modal('hide');
    }
}

module.exports = {
    show,
    hide
};
