const errorTemplate = require('./../templates/error.hbs');
const template = require('./template.hbs');
const updateTitle = require('./../update-title.js');

module.exports = (result) => {
    const content = (result.error) ? errorTemplate(result.data) : template(result.data);
    updateTitle(result);
    $('#warpjs-content-placeholder').html(content);
};
