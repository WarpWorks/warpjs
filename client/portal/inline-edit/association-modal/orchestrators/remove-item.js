import cloneDeep from 'lodash/cloneDeep';

import * as actionCreators from './../action-creators';
import constants from './../../constants';

const { proxy, toast } = window.WarpJS;

export default async (dispatch, items, item) => {
    const toastLoading = toast.loading($, "Unlinking...");

    try {
        await proxy.del($, item._links.self.href);
        constants.setDirty();
        toast.success($, "Unlinked");
        const cloned = cloneDeep(items).filter((current) => current.id !== item.id);
        dispatch(actionCreators.updateItems(cloned));
    } catch (err) {
        toast.error($, err.message, "Error!");
    } finally {
        toast.close($, toastLoading);
    }
};
