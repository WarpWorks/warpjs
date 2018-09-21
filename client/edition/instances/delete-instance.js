const Promise = require('bluebird');

const deleteConfirm = require('./../delete-confirm');

module.exports = ($) => {
    $('[data-warpjs-status="instances"] [data-warpjs-action="delete"]').on('click', function() {
        const deleteUrl = $(this).closest('[data-warpjs-url]').data('warpjsUrl');

        Promise.resolve()
            .then(() => deleteConfirm($, this))
            .then((confirmed) => {
                if (confirmed) {
                    Promise.resolve()
                        .then(() => window.WarpJS.toast.loading($, "Deleting document", "Deleting..."))
                        .then((toastLoading) => Promise.resolve()
                            .then(() => window.WarpJS.proxy.del($, deleteUrl))
                            .then(() => window.WarpJS.toast.success($, "Document deleted.", "Success"))
                            .then(() => $(this).closest('tr').remove())
                            .catch((err) => window.WarpJS.toast.error($, err.message, "Error removing document"))
                            .finally(() => window.WarpJS.toast.close($, toastLoading))
                        )
                    ;
                }
            })
        ;
    });
};
