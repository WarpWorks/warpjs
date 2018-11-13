import cloneDeep from 'lodash/cloneDeep';

import debug from './../../../debug';
const log = debug('inline-edit/association-modal/orchestrators/add-item');

export default (dispatch, items, item, url) => {
    const cloned = cloneDeep(items);
    log("cloned=", cloned);

    const indexOf = cloned.findIndex((currentItem) => currentItem.id === item.id);
    log("indexOf=", indexOf);

    if (indexOf === -1) {
        return
    }
};
