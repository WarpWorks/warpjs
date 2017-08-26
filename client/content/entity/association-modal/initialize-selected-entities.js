const constants = require('./constants');
const template = require('./selected-entities.hbs');

module.exports = ($, instanceDoc, element) => {
    const entities = $(element).closest('.warpjs-selected-entities').children('.warpjs-selected-item')
        .map((idx, element) => ({
            type: $(element).data('warpjsType'),
            id: $(element).data('warpjsId'),
            displayName: $(element).data('warpjsDisplayName'),
            relnDesc: $(element).data('warpjsRelationshipDescription'),
            docLevel: $(element).data('warpjsDocLevel')
        }))
        .get();

    const content = template({entities});
    $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities`, instanceDoc).html(content);
};
