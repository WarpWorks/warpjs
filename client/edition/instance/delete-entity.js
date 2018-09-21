const Promise = require('bluebird');

const deleteConfirm = require('./../delete-confirm');

module.exports = ($) => {
    $(document).on('click', '[data-warpjs-action="delete"][data-warpjs-url]:not([disabled])', function() {
        Promise.resolve()
            .then(() => deleteConfirm($, this))
            .then((confirmed) => {
                if (confirmed) {
                    Promise.resolve()
                        .then(() => window.WarpJS.toast.loading($, "This can take few seconds.", "Deleting..."))
                        .then((toastLoading) => Promise.resolve()
                            .then(() => window.WarpJS.proxy.del($, $(this).data('url')))
                            .then(() => window.WarpJS.toast.success($, "Document deleted.", "Success"))
                            .catch((err) => window.WarpJS.toast.error($, err.message, "Error removing document"))
                            .finally(() => window.WarpJS.toast.close($, toastLoading))
                        )
                    ;
                }
            })
        ;
    });
};
