const Promise = require('bluebird');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', '[data-warpjs-action="delete-row"][data-warpjs-url]', function() {
        const ajaxOptions = {
            method: 'DELETE',
            url: $(this).data('warpjsUrl')
        };

        return Promise.resolve()
            .then(() => $.ajax(ajaxOptions))
            .then(() => {
                $(this).closest('tr').remove();
                // TODO: One row removed, do we need to go fetch more data to
                // fill it up? Need to update the values of the navigation.
            })
            .catch((err) => console.log("Error delete-row:", err));
    });
};
