const Promise = require('bluebird');

const patch = require('./../../patch');

module.exports = ($) => {
    $('[data-doc-level!=""][data-doc-level]').on('change', function() {
        const updatePath = $(this).data('doc-level');
        const updateValue = $(this).val();

        return Promise.resolve()
            .then(() => patch($, updatePath, updateValue))
            .then((res) => {
                console.log("---OK:", res);
            })
            .catch((err) => {
                console.log("***ERROR:", err);
            });
    });
};
