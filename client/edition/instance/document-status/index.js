const constants = require('./constants');
const modalTemplate = require('./modal.hbs');

module.exports = ($, instanceDoc) => {
    $('select[data-doc-level="Enum:Status"]', instanceDoc).on('change', function() {
        const statusValue = $(this).val();
        $(constants.PLACEHOLDER, instanceDoc).removeClass(function(index, className) {
            return className.split(' ').filter((aClass) => aClass.indexOf(`${constants.BASE_CLASS}-`) === 0).join(" ");
        });
        $(constants.PLACEHOLDER, instanceDoc).addClass(`${constants.BASE_CLASS}-${statusValue}`);
        $(constants.PLACEHOLDER, instanceDoc).text(statusValue);
    });

    $(constants.PLACEHOLDER, instanceDoc).on('click', function() {
        console.log("Display modal");

        if (!$(constants.MODAL_SELECTOR, instanceDoc).length) {
            instanceDoc.append(modalTemplate({
                identifier: constants.IDENTIFIER,
                baseClass: constants.BASE_CLASS
            }));
        }
        $(constants.MODAL_SELECTOR, instanceDoc).modal('show');
    });
};
