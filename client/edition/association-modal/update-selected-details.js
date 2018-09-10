const constants = require('./constants');
const template = require('./selected-details.hbs');

module.exports = ($, instanceDoc) => {
    const entities = $(`${constants.DIALOG_SELECTOR} .warpjs-selected-entities li.active`, instanceDoc)
        .map((idx, element) => ({
            type: $(element).data('warpjsType'),
            id: $(element).data('warpjsId'),
            displayName: $(element).data('warpjsDisplayName'),
            relationshipDescription: $(element).data('warpjsRelationshipDescription'),
            relationshipPosition: $(element).data('warpjsRelationshipPosition'),
            docLevel: $(element).data('warpjsDocLevel')
        }))
        .get();
    const entity = entities.length ? entities[0] : {};

    const selectedDetails = $(`${constants.DIALOG_SELECTOR} .warpjs-selected-details`, instanceDoc);
    const content = template({
        entity,
        canEdit: selectedDetails.data('warpjsCanEdit') === 'true' || selectedDetails.data('warpjsCanEdit') === true
    });

    selectedDetails.html(content);
};
