const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const constants = require('./constants');
const modalTemplate = require('./modal.hbs');

const TITLE = "File Upload";

function getModal($, instanceDoc) {
    return $(constants.MODAL_SELECTOR, instanceDoc);
}

class FileUpload {
    static init($, instanceDoc) {
        instanceDoc.on('click', '[data-warpjs-action="file-upload"]', function(e) {
            const uploadButton = $(this);

            e.stopPropagation();
            e.preventDefault();

            let modal = getModal($, instanceDoc);
            if (!modal.length) {
                instanceDoc.append(modalTemplate({
                    MODAL_NAME: constants.MODAL_NAME,
                    title: TITLE,
                    url: uploadButton.data('warpjsUrl')
                }));

                modal = getModal($, instanceDoc);

                $('input[type="file"]', modal).on('change', function() {
                    $(this).closest('.form-group').removeClass('has-error');
                });

                $('[data-warpjs-action="cancel-upload"]', modal).on('click', function(e) {
                    modal.modal('hide');
                });

                $('[data-warpjs-action="confirm-upload"]', modal).on('click', function(e) {
                    const input = $('form input[type="file"]', modal).get(0);
                    const file = input.files;

                    if (file.length) {
                        const data = new FormData();
                        data.append('file', file[0], file[0].name);

                        const url = $('form', modal).data('warpjsUrl');

                        Promise.resolve()
                            .then(() => warpjsUtils.toast.loading($, "Uploading file...", TITLE))
                            .then((toastLoading) => Promise.resolve()
                                // Not compatible with our warpjsUtils.proxy...
                                .then(() => $.ajax({
                                    method: 'POST',
                                    url,
                                    headers: {
                                        Accept: warpjsUtils.constants.HAL_CONTENT_TYPE
                                    },
                                    data,
                                    processData: false,
                                    contentType: false
                                }))
                                .then((res) => {
                                    warpjsUtils.toast.success($, "File uploaded successfully.", TITLE);
                                    modal.modal('hide');
                                    const inputField = uploadButton.closest('.form-group').find('input.warpjs-file-field');
                                    inputField.val(res._links.uploadedFile.href);
                                    inputField.trigger('change');
                                })
                                .catch((err) => {
                                    // eslint-disable-next-line no-console
                                    console.error("Error upload-file:", err);
                                    warpjsUtils.toast.error($, "File upload failed!", TITLE);
                                })
                                .finally(() => warpjsUtils.toast.close($, toastLoading))
                            )
                        ;
                    } else {
                        warpjsUtils.toast.warning($, "Please select a file to upload", TITLE);
                        $(input).closest('.form-group').addClass('has-error');
                    }
                });
            }

            $('form', modal).get().forEach((form) => form.reset());
            modal.modal('show');
        });
    }
}

module.exports = FileUpload;
