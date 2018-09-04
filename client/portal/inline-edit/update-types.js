const Promise = require('bluebird');
const warpjsUtils = require('@warp-works/warpjs-utils');

const contentConstants = require('./../../../server/content/inline-edit/constants');
const selectedDocumentsTemplate = require('./selected-documents.hbs');
const typeDocumentsTemplate = require('./type-documents.hbs');
const typeOptionsTemplate = require('./type-options.hbs');

module.exports = ($, modal, clickedElement) => Promise.resolve()
    .then(() => warpjsUtils.proxy.post($, modal.data('warpjsUrl'), {
        action: contentConstants.ACTIONS.LIST_TYPES,
        reference: {
            type: $(clickedElement).data('warpjsReferenceType'),
            id: $(clickedElement).data('warpjsReferenceId')
        }
    }))
    .then((res) => {
        $('#warpjs-inline-edit-type-selector', modal)
            .closest('.form-group')
            .removeClass('has-warning has-error')
        ;

        const instance = res._embedded && res._embedded.instances && res._embedded.instances.length ? res._embedded.instances[0] : null;
        if (instance) {
            if (instance._embedded) {
                if (instance._embedded.types) {
                    $('#warpjs-inline-edit-type-selector', modal).html(typeOptionsTemplate({types: instance._embedded.types}));
                    $('#warpjs-inline-edit-type-selector', modal).prop('disabled', (instance._embedded.types.length <= 1));
                } else {
                    warpjsUtils.toast.error($, "Could not find any types.");
                }

                if (instance._embedded.documents) {
                    $('.warpjs-section-type-documents', modal).html(typeDocumentsTemplate({documents: instance._embedded.documents}));
                }

                if (instance._embedded.associations) {
                    $('.warpjs-section-selected-documents', modal).html(selectedDocumentsTemplate({documents: instance._embedded.associations}));
                }
            }
        } else {
            warpjsUtils.toast.error($, "Document not found");
        }
    })
    .catch((err) => {
        warpjsUtils.toast.error($, err.message, "Fetching data error");
        $('#warpjs-inline-edit-type-selector', modal)
            .html($('<option>Unable to load types</option>'))
            .closest('.form-group').addClass('has-error').removeClass('has-warning')
        ;
    })
;
