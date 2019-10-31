const filter = require('lodash/filter');
const Promise = require('bluebird');

const ChangeLogs = require('./../change-logs');
const constants = require('./../constants');
const deleteConfirm = require('./../../../edition/delete-confirm');
const itemsTemplate = require('./../text-modal-elements.hbs');

const saveItemDelete = ($, modal, element, items) => {
    const { proxy, toast } = window.WarpJS;

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
            .then(() => proxy.patch($, modal.data('warpjsUrl'), data))
            .then(() => constants.setDirty())
            .then(() => ChangeLogs.dirty())
            .then(() => {
                items = filter(items, (item) => item.id !== data.id);
                $('.warpjs-document-elements > div > .warpjs-content', modal).html(itemsTemplate({ items: items }));
                if (items.length) {
                    $('.warpjs-list-container .warpjs-list-item:first-child .warpjs-list-item-value').trigger('click');
                } else {
                    $('.warpjs-detail-container .warpjs-placeholder').html('');
                }
            })
        )
        .catch((err) => toast.error($, err.message, "Failed"))
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
