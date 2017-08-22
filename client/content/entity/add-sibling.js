const Promise = require('bluebird');

module.exports = ($) => {
    $('[data-warpjs-status="instance"] [data-warpjs-action="add-sibling"]').on('click', function() {
        const ajaxOptions = {
            method: 'POST',
            url: $(this).data('warpjsUrl')
        };

        return Promise.resolve()
            .then(() => $.ajax(ajaxOptions))
            .then((res) => {
                document.location.href = res._links.redirect.href;
            })
            .catch((err) => {
                console.log("failed: err=", err);
            });
    });
};
