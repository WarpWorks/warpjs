// const FileUpload = require('./../../../../edition/file-upload');

const constants = require('./../../../../edition/file-upload/constants.js');
const inlineConstants = require('./../../constants.js');
const modalTemplate = require('./../../../../edition/file-upload/modal.hbs');
const TITLE = "File Upload";

function getModal($, instanceDoc) {
    return $(constants.MODAL_SELECTOR, instanceDoc);
}

module.exports = ($, modal) => {
    // FileUpload.init($, modal);

    modal.on('click', '.image-carousel-container .warpjs-inline-edit-image-upload-button', function(e) {
        const uploadButton = $(this);
        e.stopPropagation();
        e.preventDefault();

        let imageUploadModal = getModal($, $('body'));
        if (!imageUploadModal.length) {
            $('body').append(modalTemplate({
                MODAL_NAME: 'file-upload',
                title: TITLE,
                url: uploadButton.data('warpjsUrl')
            }));

            imageUploadModal = getModal($, $('body'));

            $('input[type="file"]', imageUploadModal).on('change', function() {
                $(this).closest('.form-group').removeClass('has-error');
            });

            $('[data-warpjs-action="cancel-upload"]', imageUploadModal).on('click', function(e) {
                imageUploadModal.modal('hide');
            });

            imageUploadModal.on('hidden.bs.modal', (event) => {
                imageUploadModal.remove();
            });

            $('[data-warpjs-action="confirm-upload"]').on('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                const input = $('form input[type="file"]').get(0);
                const files = input.files;
                if (files.length) {
                    const data = new FormData();
                    data.append('file', files[0], files[0].name);
                    const url = $('form', imageUploadModal).data('warpjsUrl');

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
                                window.WarpJS.toast.success($, "File uploaded successfully.", TITLE);
                                imageUploadModal.modal('hide');
                                const uploadUrl = $('[data-warpjs-action="file-upload"]').data('warpjsAddImageUrl');
                                const docLevel = $('[data-warpjs-action="file-upload"]').data('warpjsDocLevel');
                                const itemId = $('[data-warpjs-action="file-upload"]').data('warpjsItemId');

                                const data = {
                                    "width": res.info.Width,
                                    "height": res.info.Height,
                                    "url": res._links.uploadedFile.href,
                                    "docLevel": docLevel,
                                    "id": itemId
                                };

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
                            .then(() => inlineConstants.setDirty())
                            .then(() => true)
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
        }

        $('form', imageUploadModal).get().forEach((form) => form.reset());
        imageUploadModal.modal('show');
    });
};
