const _ = require('lodash');
const Promise = require('bluebird');

const constants = require('./constants');
const itemsTemplate = require('./text-modal-elements.hbs');

Array.prototype.moveOnePosition = function(element, offset) {
    const index = this.indexOf(element);
    const newIndex = index + offset;
    if (newIndex > -1 && newIndex < this.length) {
        const removedElement = this.splice(index, 1)[0];
        this.splice(newIndex, 0, removedElement);
    }
};

Array.prototype.moveToAnEnd = function(element, position) {
    const index = this.indexOf(element);
    const removedElement = this.splice(index, 1)[0];
    if (position === 'first') {
        this.unshift(removedElement);
    } else if (position === 'last') {
        this.push(removedElement);
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
    .then(() => _.find(items, ['id', itemId]))
    .then((foundItem) => Promise.resolve()
        .then(() => _.findIndex(items, ['id', itemId]))
        .then((foundItemIndex) => {
            if (isNaN(offset)) {
                items.moveToAnEnd(foundItem, offset);
            } else {
                items.moveOnePosition(foundItem, offset);
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
        $('.warpjs-document-elements > div > .warpjs-content', modal).html(itemsTemplate({items: items}));
        $('.warpjs-list-item-value[data-warpjs-id="' + itemId + '"]').closest('.warpjs-list-item').addClass('warpjs-list-item-selected');
        $.each(items, (index, item) => {
            $('.warpjs-list-item-value[data-warpjs-id="' + item.id + '"]').data('warpjsPosition', index);
        });
        $('.warpjs-navigation.warpjs-navigation-position').html('Position ' + (_.findIndex(items, ['id', itemId]) + 1));
    })
;
