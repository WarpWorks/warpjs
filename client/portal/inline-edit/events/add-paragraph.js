const ChangeLogs = require('./../change-logs');
const constants = require('./../constants');
const itemsTemplate = require('./../text-modal-elements.hbs');
const moveAndSave = require('./../move-and-save');

const { proxy, toast } = window.WarpJS;

module.exports = async ($, modal, event, items) => {
    event.preventDefault();

    const element = event.target;
    const data = {
        docLevel: $(element).data('warpjsDocLevel'),
        action: 'add'
    };

    try {
        const newInstance = await proxy.patch($, modal.data('warpjsUrl'), data);
        constants.setDirty();
        ChangeLogs.dirty();

        if (newInstance.newParagraph) {
            const newParagraph = newInstance.newParagraph;
            const newItem = {
                description: newParagraph.Content,
                id: newParagraph._id,
                images: "[]",
                isOfHeadingLevel: { H1: true, H2: false, H3: false, H4: false, H5: false, h6: false },
                level: "H1",
                name: newParagraph.Heading,
                position: 0,
                visibility: newParagraph.Visibility,
                reference: {
                    type: $(element).data('warpjsReferenceType'),
                    id: $(element).data('warpjsReferenceId'),
                    name: $(element).data('warpjsReferenceName')
                },
                type: "Paragraph"
            };
            items.push(newItem);
        }

        $('.warpjs-document-elements > div > .warpjs-content', modal).html(itemsTemplate({ items: items }));
        moveAndSave($, modal, newInstance.newParagraph._id, items, 'last');
        $('.warpjs-list-item-value[data-warpjs-id="' + newInstance.newParagraph._id + '"]').trigger('click');
    } catch (err) {
        toast.error($, err.message, "Failed");
    }

    return items;
};
