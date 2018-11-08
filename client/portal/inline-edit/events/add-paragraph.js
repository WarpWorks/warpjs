const Promise = require('bluebird');

const itemsTemplate = require('./../text-modal-elements.hbs');
const moveAndSave = require('./../move-and-save');

module.exports = ($, modal, event, items) => {
    event.preventDefault();

    return Promise.resolve()
        .then(() => event.target)
        .then((element) => Promise.resolve()
            .then(() => ({
                docLevel: $(element).data('warpjsDocLevel'),
                action: 'add'
            }))
            .then((data) => Promise.resolve()
                .then(() => window.WarpJS.proxy.patch($, modal.data('warpjsUrl'), data))
                .then((newInstance) => Promise.resolve()
                    .then(() => modal.data('warpjsIsDirty', true))
                    .then(() => {
                        if (newInstance.newParagraph) {
                            const newParagraph = newInstance.newParagraph;
                            const newItem = {
                                description: newParagraph.Content,
                                id: newParagraph._id,
                                images: "[]",
                                isOfHeadingLevel: {H1: true, H2: false, H3: false, H4: false, H5: false, h6: false},
                                level: "H1",
                                name: newParagraph.Heading,
                                position: 0,
                                reference: {
                                    type: $(element).data('warpjsReferenceType'),
                                    id: $(element).data('warpjsReferenceId'),
                                    name: $(element).data('warpjsReferenceName')
                                },
                                type: "Paragraph"
                            }
                            items.push(newItem);
                        }
                    })
                    .then(() => $('.warpjs-document-elements > div > .warpjs-content', modal).html(itemsTemplate({items: items})))
                    .then(() => moveAndSave($, modal, newInstance.newParagraph._id, items, 'last'))
                    .then(() => $('.warpjs-list-item-value[data-warpjs-id="' + newInstance.newParagraph._id + '"]').trigger('click'))
                )
            )
            .catch((err) => window.WarpJS.toast.error($, err.message, "Failed"))
            .then(() => items)
        )
    ;
};