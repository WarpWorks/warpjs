import cloneDeep from 'lodash/cloneDeep';

import * as actionCreators from './../action-creators';
import constants from './../../constants';
import setPositions from './set-positions';

// import debug from './../../../debug';
// const log = debug('inline-edit/association-modal/orchestrators/add-item');

export default async (dispatch, items, item, itemUrl, reorderUrl) => {
    const cloned = cloneDeep(items);
    const indexOf = cloned.findIndex((currentItem) => currentItem.id === item.id);

    if (indexOf === -1) {
        // The item is not already in the list of selected items. We need to add
        // the item, set it as the last item, and setPositions to be sure
        // everything is in order.
        const newItem = {
            id: item.id,
            type: item.type,
            desc: '',
            position: items.length + 1
        };

        let toastLoading = window.WarpJS.toast.loading($, "Adding...");
        try {
            const result = await window.WarpJS.proxy.post($, itemUrl, newItem);
            if (result && result._embedded && result._embedded.references && result._embedded.references.length) {
                window.WarpJS.toast.success($, "Added");
                cloned.push({
                    _links: result._embedded.references[0]._links,
                    type: newItem.type,
                    id: newItem.id,
                    relnDescription: newItem.desc,
                    relnPosition: newItem.position,
                    name: item.name
                });

                constants.setDirty();

                const toUpdate = setPositions(cloned);
                if (toUpdate.length) {
                    toastLoading = window.WarpJS.toast.loading($, "Updating positions...");
                    try {
                        await window.WarpJS.proxy.patch($, reorderUrl, toUpdate);
                        window.WarpJS.toast.success($, "Updated positions");
                    } catch (err) {
                        console.error("Error updating positions: err=", err);
                        window.WarpJS.toast.error($, err.message, "Error updating positions!");
                    }
                }

                dispatch(actionCreators.updateItems(cloned));
            }
        } catch (err) {
            console.error("Error! err=", err);
            window.WarpJS.toast.error($, err.message, "Error!");
        } finally {
            window.WarpJS.toast.close($, toastLoading);
        }
    }
};
