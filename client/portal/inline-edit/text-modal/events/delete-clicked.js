const deleteConfirm = require('./../../../../edition/delete-confirm');

const saveItemDelete = ($, modal, element) => {
    return Promise.resolve()
        .then(() => ({
            id: $(element).data('warpjsId'),
            reference: {
                type: $(element).data('warpjsReferenceType'),
                id: $(element).data('warpjsReferenceId'),
                name: $(element).data('warpjsReferenceName')
            },
            action: 'delete'
        }))
        .then((data) => window.WarpJS.proxy.patch($, modal.data('warpjsUrl'), data))
        .then(() => modal.data('warpjsIsDirty', true))
        .then(() => $('[data-warpjs-modal="warpjs-inline-edit"] .close').trigger('click'))
        .then(() => true)
        .catch((err) => window.WarpJS.toast.error($, err.message, "Failed"))
    ;
};

module.exports = ($, modal) => {
    modal.on('click', '[data-warpjs-action="inline-edit-delete"]', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return Promise.resolve()
          .then(() => deleteConfirm($, this, 'bottom'))
          .then((confirmed) => {
              if (confirmed) {
                saveItemDelete($, modal, event.target);
              }
          })
        ;
    });
};
