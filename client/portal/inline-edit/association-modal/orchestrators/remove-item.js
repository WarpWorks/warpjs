import cloneDeep from 'lodash/cloneDeep';

import * as actionCreators from './../action-creators';
import constants from './../../constants';

export default async (dispatch, items, item) => {
    const toastLoading = window.WarpJS.toast.loading($, "Removing...");

    try {
        await window.WarpJS.proxy.del($, item._links.self.href);
        constants.setDirty();
        window.WarpJS.toast.success($, "Removed");
        const cloned = cloneDeep(items).filter((current) => current.id !== item.id);
        dispatch(actionCreators.updateItems(cloned));
    } catch (err) {
        window.WarpJS.toast.error($, err.message, "Error!");
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};
