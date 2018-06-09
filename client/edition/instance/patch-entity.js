const Promise = require('bluebird');
const { proxy, toast } = require('@warp-works/warpjs-utils');

const ChangeLogs = require('./../change-logs');
const formFeedback = require('./../form-feedback');

module.exports = ($) => {
    $('[data-doc-level!=""][data-doc-level]').on('change', function() {
        const updatePath = $(this).data('doc-level');
        const updateValue = $(this).attr('type') === 'checkbox'
            ? $(this).is(':checked')
            : $(this).val()
        ;

        return Promise.resolve()
            .then(() => formFeedback.start($, this))
            .then(() => proxy.patch($, $(this).data('warpjsUrl'), { updatePath, updateValue }))
            .then(() => ChangeLogs.dirty())
            .then(() => formFeedback.success($, this))
            .catch((err) => {
                formFeedback.error($, this);
                console.error("***ERROR:", err);
                toast.error($, err.message, "Error updating field");
            })
        ;
    });
};
