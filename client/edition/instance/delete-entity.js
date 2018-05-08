const Promise = require('bluebird');
const { proxy, toast } = require('@warp-works/warpjs-utils');

const deleteConfirm = require('./../delete-confirm');

module.exports = ($) => {
    $(document).on('click', '[data-warpjs-action="delete"][data-warpjs-url]:not([disabled])', function() {
        Promise.resolve()
            .then(() => deleteConfirm($, this))
            .then((confirmed) => {
                if (confirmed) {
                    Promise.resolve()
                        .then(() => toast.loading($, "This can take few seconds.", "Deleting..."))
                        .then((toastLoading) => Promise.resolve()
                            .then(() => proxy.del($, $(this).data('url')))
                            .then(() => toast.success($, "Document deleted.", "Success"))
                            .catch((err) => toast.error($, err.message, "Error removing document"))
                            .finally(() => toast.close($, toastLoading))
                        )
                    ;
                }
            })
        ;
    });
};
