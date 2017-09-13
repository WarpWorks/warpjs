const constants = require('./constants');
const template = require('./selected-entities.hbs');

module.exports = ($, instanceDoc) => {
    const element = $(constants.DIALOG_SELECTOR, instanceDoc).data(constants.CURRENT_ELEMENT_KEY);
    const entities = $(element).closest('.warpjs-selected-entities').children('.warpjs-selected-item')
        .map((idx, el) => ({
            type: $(el).data('warpjsType'),
            id: $(el).data('warpjsId'),
            displayName: $(el).data('warpjsDisplayName'),
            relnDesc: $(el).data('warpjsRelationshipDescription'),
            docLevel: $(el).data('warpjsDocLevel')
        }))
        .get();

    const content = template({entities});
    $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities`, instanceDoc).html(content);
};
