const FileUpload = require('./../../../../edition/file-upload');
const TITLE = "File Upload";

module.exports = ($, modal) => {
    FileUpload.init($, modal);

    modal.on('click', '.image-carousel-container .warpjs-inline-edit-image-upload-button', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $('input[type="file"]', modal).on('change', function() {
            $(this).closest('.form-group').removeClass('has-error');
        });

        $('[data-warpjs-action="cancel-upload"]', modal).on('click', function(e) {
            modal.modal('hide');
        });

        modal.on('hidden.bs.modal', (event) => {
            modal.remove();
        });

        $('[data-warpjs-action="confirm-upload"]', modal).on('click', function(e) {
            const input = $('form input[type="file"]').get(0);
            const files = input.files;
            console.log('confirm upload', files[0], files[0].name);
            if (files.length) {
                const data = new FormData();
                data.append('file', files[0], files[0].name);
                const url = $('form', modal).data('warpjsUrl');

                Promise.resolve()
                    .then(() => window.WarpJS.toast.loading($, "Uploading file...", TITLE))
                    .then((toastLoading) => Promise.resolve()
                        .then(() => $.ajax({
                            method: 'POST',
                            url,
                            headers: {
                                Accept: window.WarpJS.HAL_CONTENT_TYPE
                            },
                            data,
                            processData: false,
                            contentType: false
                        }))
                        .then((res) => {
                            console.log('res', res);
                            window.WarpJS.toast.success($, "File uploaded successfully.", TITLE);
                            modal.modal('hide');

                            const uploadUrl = $('[data-warpjs-action="file-upload"]').data('warpjsAddImageUrl');
                            const docLevel = $('[data-warpjs-action="file-upload"]').data('warpjsDocLevel');
                            const data = {
                              "width": res.info.Width,
                              "height": res.info.Height,
                              "url": res._links.uploadedFile.href,
                              "docLevel": docLevel
                            }

                            Promise.resolve()
                                .then(() => $.ajax({
                                    method: 'POST',
                                    url: uploadUrl,
                                    contentType: 'application/json; charset=utf-8',
                                    data: JSON.stringify(data)
                                }))
                                .then((res) => {

                                })
                            ;
                        })
                        .catch((err) => {
                            // eslint-disable-next-line no-console
                            console.error("Error upload-file:", err);
                            window.WarpJS.toast.error($, "File upload failed!", TITLE);
                        })
                        .finally(() => window.WarpJS.toast.close($, toastLoading))
                    )
                ;
            } else {
                window.WarpJS.toast.warning($, "Please select a file to upload", TITLE);
                $(input).closest('.form-group').addClass('has-error');
            }
        });

        $('form', modal).get().forEach((form) => form.reset());
        modal.modal('show');
    });
};
