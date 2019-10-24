const Promise = require('bluebird');

const deleteConfirm = require('./../delete-confirm');

const { proxy, toast } = window.WarpJS;

module.exports = ($) => {
    $('[data-warpjs-status="instances"] [data-warpjs-action="delete"]').on('click', function() {
        const deleteUrl = $(this).closest('[data-warpjs-url]').data('warpjsUrl');

        Promise.resolve()
            .then(() => deleteConfirm($, this))
            .then((confirmed) => {
                if (confirmed) {
                    Promise.resolve()
                        .then(() => toast.loading($, "Deleting document", "Deleting..."))
                        .then((toastLoading) => Promise.resolve()
                            .then(() => proxy.del($, deleteUrl))
                            .then(() => toast.success($, "Document deleted.", "Success"))
                            .then(() => $(this).closest('tr').remove())
                            .catch((err) => toast.error($, err.message, "Error removing document"))
                            .finally(() => toast.close($, toastLoading))
                        )
                    ;
                }
            })
        ;
    });
};
