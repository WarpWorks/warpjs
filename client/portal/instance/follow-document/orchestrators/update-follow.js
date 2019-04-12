import * as actionCreators from './../action-creators';
// import _debug from './debug'; const debug = _debug('update-follow');

export default async (dispatch, url, current) => {
    const toastLoading = window.WarpJS.toast.loading($, "Saving...");
    try {
        await window.WarpJS.proxy.get($, url);
        window.WarpJS.toast.success($, "Saved.");
        dispatch(actionCreators.updateFollow(!current));
    } catch (err) {
        console.error("error update-follow:", err);
        window.WarpJS.toast.error($, err.message, "Error!");
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};
