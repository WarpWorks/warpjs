const Promise = require('bluebird');

module.exports = ($) => {
    $('[data-doc-level!=""][data-doc-level]').on('change', function() {
        const updatePath = $(this).data('doc-level');
        console.log('updatePath=', updatePath);
        const updateValue = $(this).val();
        console.log('updateValue=', updateValue);

        const ajaxOptions = {
            method: 'PATCH',
            data: {
                updatePath,
                updateValue
            }
        };

        return Promise.resolve()
            .then(() => $.ajax(ajaxOptions))
            .then((res) => {
                console.log("---OK:", res);
            })
            .catch((err) => {
                console.log("***ERROR:", err);
            });
    });
};
