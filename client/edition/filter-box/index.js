const _ = require('lodash');

module.exports = ($, filterBoxContainer, filterItemSelector, itemsContainer) => {
    const filterBox = $('[data-warpjs-type="filter-box"]', filterBoxContainer);

    filterBox.keyup(_.debounce(
        function() {
            const filterBoxValue = $(this).val().toLowerCase().trim();

            $(filterItemSelector, itemsContainer).each(function(index, element) {
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
