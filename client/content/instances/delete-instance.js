module.exports = ($) => {
    $('[data-warpjs-status="instances"] [data-warpjs-action="delete"]').on('click', function() {
        const deleteUrl = $(this).closest('[data-warpjs-url]').data('warpjsUrl');
        const ajaxOptions = {
            method: 'DELETE',
            url: deleteUrl
        };

        console.log("ajaxOptions=", ajaxOptions);
    });
};
