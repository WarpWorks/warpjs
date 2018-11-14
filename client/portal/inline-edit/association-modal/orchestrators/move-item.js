import cloneDeep from 'lodash/cloneDeep';

import * as actionCreators from './../action-creators';
import constants from './../../constants';
import setPositions from './set-positions';
import swapArrayItems from './swap-array-items';

export default async (dispatch, items, item, moveDown, url) => {
    const cloned = cloneDeep(items);
    const indexOf = cloned.findIndex((currentItem) => currentItem.id === item.id);

    if (indexOf !== -1) {
        swapArrayItems(cloned, indexOf, indexOf + (moveDown ? 1 : -1));
    }

    const toUpdate = setPositions(cloned);
    cloned.sort((a, b) => a.relnPosition - b.relnPosition);

    const toastLoading = window.WarpJS.toast.loading($, "saving...");
    try {
        await window.WarpJS.proxy.patch($, url, toUpdate);

        constants.setDirty();

        window.WarpJS.toast.success($, "Saved");
        dispatch(actionCreators.updateItems(cloned));
    } catch (err) {
        console.error("error patch:", err);
        window.WarpJS.toast.error($, err.message, "Error!");
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};
