const _ = require('lodash');
const Promise = require('bluebird');

const deleteConfirm = require('./../../../edition/delete-confirm');
const itemsTemplate = require('./../text-modal-elements.hbs');

const saveItemDelete = ($, modal, element, items) => {
    return Promise.resolve()
        .then(() => ({
            id: $(element).data('warpjsId'),
            reference: {
                type: $(element).data('warpjsReferenceType'),
                id: $(element).data('warpjsReferenceId'),
                name: $(element).data('warpjsReferenceName')
            },
            docLevel: $(element).data('warpjsReferenceType') + ':' + $(element).data('warpjsReferenceName') + '.Entity:' + $(element).data('warpjsId'),
            action: 'delete'
        }))
        .then((data) => Promise.resolve()
            .then(() => window.WarpJS.proxy.patch($, modal.data('warpjsUrl'), data))
            .then(() => modal.data('warpjsIsDirty', true))
            .then(() => {
                items = _.filter(items, (item) => {
                    return item.id !== data.id;
                });
                $('.warpjs-document-elements > div > .warpjs-content', modal).html(itemsTemplate({items: items}));
                if (items.length) {
                    $('.warpjs-list-container .warpjs-list-item:first-child .warpjs-list-item-value').trigger('click');
                } else {
                    $('.warpjs-detail-container .warpjs-placeholder').html('');
                }
            })
        )
        .catch((err) => window.WarpJS.toast.error($, err.message, "Failed"))
        .then(() => items)
    ;
};

module.exports = ($, modal, event, items) => Promise.resolve()
    .then(() => deleteConfirm($, event.target, 'bottom'))
    .then((confirmed) => {
        if (confirmed) {
            return saveItemDelete($, modal, event.target, items);
        }
    })
;
