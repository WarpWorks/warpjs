const Promise = require('bluebird');

module.exports = ($) => {
    $('[data-action="create-new-entity"]').on('click', function() {
        const ajaxOptions = {
            method: 'POST',
            url: $(this).data('url')
        };

        return Promise.resolve()
            .then(() => $.ajax(ajaxOptions))
            .then((res) => {
                console.log("---OK:", res);
            })
            .catch((err) => {
                console.log("***ERR:", err);
            });
    });
};
