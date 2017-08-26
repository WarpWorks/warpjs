const constants = require('./constants');
const template = require('./selected-details.hbs');

module.exports = ($, instanceDoc) => {
    const entities = $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities li.active`, instanceDoc)
        .map((idx, element) => ({
            id: $(element).data('warpjsId'),
            displayName: $(element).data('warpjsDisplayName'),
            relationshipDescription: $(element).data('warpjsRelationshipDescription'),
            docLevel: $(element).data('warpjsDocLevel')
        }))
        .get();
    const entity = entities.length ? entities[0] : {};
    const content = template({entity});
    $(`${constants.DIALOG_SELECTOR} .warpjs-selected-details`, instanceDoc).html(content);
};
