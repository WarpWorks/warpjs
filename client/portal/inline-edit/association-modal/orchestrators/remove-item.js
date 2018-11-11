import cloneDeep from 'lodash/cloneDeep';

import * as actionCreators from './../action-creators';

export default async (dispatch, items, item) => {
    const toastLoading = window.WarpJS.toast.loading($, "Removing...");

    try {
        await window.WarpJS.proxy.del($, item._links.self.href);
        window.WarpJS.toast.success($, "Saved");
        const cloned = cloneDeep(items).filter((current) => current.id !== item.id);
        dispatch(actionCreators.updateItems(cloned));
    } catch (err) {
        window.WarpJS.toast.error($, err.message, "Error!");
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};
