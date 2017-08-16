module.exports = ($) => {
    $(document).on('click', '[data-action="delete-entity"]', function() {
        console.log("delete:", $(this).data('url'));

        const ajaxConfig = {
            url: $(this).data('url'),
            method: 'DELETE'
        };

        return Promise.resolve()
            .then(() => $.ajax(ajaxConfig))
            .then((res) => {
                console.log("res=", res);
            })
            .catch((err) => {
                console.log("res ERRORS=", err);
            })
            .finally(() => {
            })
    });
};
