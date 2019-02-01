const heading = require('./heading');
const headingLevel = require('./heading-level');
const language = require('./language');
const uploadImageClicked = require('./upload-image-clicked');
const visibility = require('./visibility');

module.exports = ($, modal) => {
    heading($, modal);
    headingLevel($, modal);
    language($, modal);
    uploadImageClicked($, modal);
    visibility($, modal);
};
