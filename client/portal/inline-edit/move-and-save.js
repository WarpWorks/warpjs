const find = require('lodash/find');
const findIndex = require('lodash/findIndex');
const Promise = require('bluebird');

const constants = require('./constants');
const itemsTemplate = require('./text-modal-elements.hbs');

const moveOnePosition = (items, element, offset) => {
    const index = items.indexOf(element);
    const newIndex = index + offset;
    if (newIndex > -1 && newIndex < items.length) {
        const removedElement = items.splice(index, 1)[0];
        items.splice(newIndex, 0, removedElement);
    }
};

const moveToAnEnd = (items, element, position) => {
    const index = items.indexOf(element);
    const removedElement = items.splice(index, 1)[0];
    if (position === 'first') {
        items.unshift(removedElement);
    } else if (position === 'last') {
        items.push(removedElement);
    }
};

const saveItemPosition = ($, modal, item, index) => {
    if (index !== item.position) {
        return Promise.resolve()
            .then(() => $('.warpjs-list-item-value[data-warpjs-id="' + item.id + '"]'))
            .then((itemElement) => Promise.resolve()
                .then(() => ({
                    id: item.id,
                    field: 'Position',
                    reference: {
                        type: $(itemElement).data('warpjsReferenceType'),
                        id: $(itemElement).data('warpjsReferenceId'),
                        name: $(itemElement).data('warpjsReferenceName')
                    },
                    oldValue: item.position,
                    newValue: index
                }))
                .then((data) => window.WarpJS.proxy.patch($, modal.data('warpjsUrl'), data))
                .then(() => constants.setDirty())
                .then(() => true)
                .catch((err) => window.WarpJS.toast.error($, err.message, "Failed"))
            )
        ;
    }
};

module.exports = ($, modal, itemId, items, offset) => Promise.resolve()
    .then(() => find(items, [ 'id', itemId ]))
    .then((foundItem) => Promise.resolve()
        .then(() => findIndex(items, [ 'id', itemId ]))
        .then((foundItemIndex) => {
            if (isNaN(offset)) {
                moveToAnEnd(items, foundItem, offset);
            } else {
                moveOnePosition(items, foundItem, offset);
            }
        })
    )
    .then(() => window.WarpJS.toast.loading($, "Saving..."))
    .then((toastLoading) => Promise.resolve()
        .then(() => Promise.each(items, (item, index) => saveItemPosition($, modal, item, index)))
        .then(() => window.WarpJS.toast.success($, "Data updated"))
        .finally(() => window.WarpJS.toast.close($, toastLoading))
    )
    .then(() => {
        $('.warpjs-document-elements > div > .warpjs-content', modal).html(itemsTemplate({ items: items }));
        $('.warpjs-list-item-value[data-warpjs-id="' + itemId + '"]').closest('.warpjs-list-item').addClass('warpjs-list-item-selected');
        $.each(items, (index, item) => {
            $('.warpjs-list-item-value[data-warpjs-id="' + item.id + '"]').data('warpjsPosition', index);
        });
        $('.warpjs-navigation.warpjs-navigation-position').html('Position ' + (findIndex(items, [ 'id', itemId ]) + 1));
    })
;
