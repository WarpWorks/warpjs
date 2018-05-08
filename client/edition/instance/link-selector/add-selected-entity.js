const constants = require('./constants');
const template = require('./selected-entity.hbs');

module.exports = ($, instanceDoc) => {
    instanceDoc.on('click', `.${constants.SELECTION_MODAL_CLASS} .warpjs-selection-entities .warpjs-selection-entity`, function() {
        const id = $(this).data('warpjsId');
        const type = $(this).data('warpjsType');
        const name = $(this).data('warpjsName');

        const value = `{{${name},${type},${id}}}`;

        const content = template({
            name,
            value
        });

        $(`.${constants.SELECTION_MODAL_CLASS} .warpjs-selected-entities`).append(content);
    });
};
