const addSelectedEntity = require('./add-selected-entity');
const constants = require('./constants');
const initializeSelect = require('./initialize-select');
const removeSelectedEntity = require('./remove-selected-entity');
const saveSeletedEntities = require('./save-selected-entities');
const selectOnChange = require('./select-on-change');
const template = require('./template.hbs');

// const debug = require('./debug')('index');

const { proxy } = window.WarpJS;

module.exports = async ($, instanceDoc, specificType) => {
    try {
        if (!$(`.${constants.SELECTION_MODAL_CLASS}`).length) {
            selectOnChange($, instanceDoc);
            addSelectedEntity($, instanceDoc);
            removeSelectedEntity($, instanceDoc);
            saveSeletedEntities($, instanceDoc);

            const res = await proxy.get($, instanceDoc.data('warpjsTypesUrl'));

            const entities = specificType
                ? res._embedded.entities.filter((entity) => entity.type === specificType)
                : res._embedded.entities;

            const content = template({
                SELECTION_MODAL_CLASS: constants.SELECTION_MODAL_CLASS,
                entities
            });
            instanceDoc.append(content);
        }
        initializeSelect($, instanceDoc);
        $(`.${constants.SELECTION_MODAL_CLASS}`).modal('show');
    } catch (err) {
        // TODO: Show error.
        console.error("ERROR:", err);
    }
};
