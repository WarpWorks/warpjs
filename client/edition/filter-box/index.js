const _ = require('lodash');

module.exports = ($) => {
    $(document).on('keyup', '.warpjs-filter-box-container [data-warpjs-type="filter-box"]', _.debounce(
        function() {
            const filterBoxValue = $(this).val().toLowerCase().trim();

            $(this).closest('.warpjs-filter-box-container').find('.warpjs-filter-box-item').each((index, element) => {
                if ($(element).text().toLowerCase().indexOf(filterBoxValue) === -1) {
                    $(element).hide();
                } else {
                    $(element).show();
                }
            });
        },
        250
    ));
};
