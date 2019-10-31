import * as actionCreators from './../action-creators';
// import _debug from './debug'; const debug = _debug('update-follow');

const { proxy, toast } = window.WarpJS;

export default async (dispatch, url, current) => {
    const toastLoading = toast.loading($, "Saving...");
    try {
        await proxy.get($, url);
        toast.success($, "Saved.");
        dispatch(actionCreators.updateFollow(!current));
    } catch (err) {
        console.error("error update-follow:", err);
        toast.error($, err.message, "Error!");
    } finally {
        toast.close($, toastLoading);
    }
};
