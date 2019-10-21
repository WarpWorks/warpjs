const forEach = require('lodash/forEach');
const Promise = require('bluebird');

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

                modal.on('hidden.bs.modal', (event) => {
                    modal.remove();
                });

                $('[data-warpjs-action="confirm-upload"]', modal).on('click', function(e) {
                    const input = $('form input[type="file"]', modal).get(0);
                    const files = input.files;

                    if (files.length) {
                        const data = new FormData();
                        data.append('file', files[0], files[0].name);

                        const url = $('form', modal).data('warpjsUrl');

                        Promise.resolve()
                            .then(() => window.WarpJS.toast.loading($, "Uploading file...", TITLE))
                            .then((toastLoading) => Promise.resolve()
                                // Not compatible with our window.WarpJS.proxy...
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
                                    let changeIndex = 0;
                                    window.WarpJS.toast.success($, "File uploaded successfully.", TITLE);
                                    modal.modal('hide');
                                    const inputField = uploadButton.closest('.form-group').find('input.warpjs-file-field');
                                    inputField.val(res._links.uploadedFile.href);
                                    inputField.trigger('change');
                                    changeIndex += 1;

                                    if (res.info) {
                                        const tabPane = uploadButton.closest('.tab-pane');

                                        forEach(res.info, (value, key) => {
                                            const inputField = tabPane.find(`.warpjs-basic-property-${key} input`);
                                            if (inputField) {
                                                changeIndex += 1;
                                                inputField.val(value);

                                                // Introduce delay to avoid
                                                // concurrent changes.
                                                setTimeout(() => inputField.trigger('change'), changeIndex * 500);
                                            }
                                        });
                                    }
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
            }

            $('form', modal).get().forEach((form) => form.reset());
            modal.modal('show');
        });
    }
}

module.exports = FileUpload;
