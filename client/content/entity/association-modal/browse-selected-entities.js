const constants = require('./constants');
const updateSelectedDetails = require('./update-selected-details');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `${constants.DIALOG_SELECTOR} .warpjs-selected-entities li a`, function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).parent().siblings('li').removeClass('active');
        $(this).parent().addClass('active');
        updateSelectedDetails($, instanceDoc);
    });
};
