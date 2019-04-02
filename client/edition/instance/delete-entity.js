const Promise = require('bluebird');

const deleteConfirm = require('./../delete-confirm');

module.exports = ($) => {
    $(document).on('click', '[data-warpjs-action="delete"][data-warpjs-url]:not([disabled])', function() {
        Promise.resolve()
            .then(() => deleteConfirm($, this))
            .then(async (confirmed) => {
                if (confirmed) {
                    const toastLoading = await window.WarpJS.toast.loading($, "This can take few seconds.", "Deleting...");
                    try {
                        const result = await window.WarpJS.proxy.del($, $(this).data('url'));
                        await window.WarpJS.toast.success($, "Document deleted.", "Success");
                        if (result && result._links && result._links.redirect && result._links.redirect.href) {
                            document.location.href = result._links.redirect.href;
                        }
                    } catch (err) {
                        await window.WarpJS.toast.error($, err.message, "Error removing document");
                    } finally {
                        await window.WarpJS.toast.close($, toastLoading);
                    }
                }
            })
        ;
    });
};
