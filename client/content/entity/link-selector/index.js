const Promise = require('bluebird');

const addSelectedEntity = require('./add-selected-entity');
const constants = require('./constants');
const initializeSelect = require('./initialize-select');
const proxy = require('./../../../proxy');
const removeSelectedEntity = require('./remove-selected-entity');
const saveSeletedEntities = require('./save-selected-entities');
const selectOnChange = require('./select-on-change');
const template = require('./template.hbs');

module.exports = ($, instanceDoc) => {
    return Promise.resolve()
        .then(() => {
            if (!$(`.${constants.SELECTION_MODAL_CLASS}`).length) {
                selectOnChange($, instanceDoc);
                addSelectedEntity($, instanceDoc);
                removeSelectedEntity($, instanceDoc);
                saveSeletedEntities($, instanceDoc);

                return Promise.resolve()
                    .then(() => proxy.get($, instanceDoc.data('warpjsTypesUrl')))
                    .then((res) => {
                        const content = template({
                            SELECTION_MODAL_CLASS: constants.SELECTION_MODAL_CLASS,
                            entities: res._embedded.entities
                        });
                        instanceDoc.append(content);
                    });
            }
        })
        .then(() => initializeSelect($, instanceDoc))
        .then(() => $(`.${constants.SELECTION_MODAL_CLASS}`).modal('show'))
        .catch((err) => {
            // TODO: Show error.
            console.log("ERROR:", err);
        });
};
