import * as actionCreators from './action-creators';

// import _debug from './debug'; const debug = _debug('orchestrators');

export const createVersion = async (dispatch, url, nextVersion) => {
    const toastLoading = await window.WarpJS.toast.loading($, `Creating version '${nextVersion}'...`, "Creating...");
    try {
        const res = await window.WarpJS.proxy.post($, url, { nextVersion });
        await window.WarpJS.toast.success($, "Done");
        window.location.href = res._links.newVersion.href;
    } catch (err) {
        const message = err && err.responseJSON ? err.responseJSON.message : 'Unknown';
        await window.WarpJS.toast.error($, message, `Error creating version '${nextVersion}'`)
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};

export const hide = (dispatch) => {
    dispatch(actionCreators.hide());
    resetVersion(dispatch);
};

export const resetVersion = (dispatch) => {
    dispatch(actionCreators.resetVersion());
};

export const show = (dispatch) => {
    dispatch(actionCreators.show());
};

export const updateVersion = (dispatch, event) => {
    dispatch(actionCreators.updateVersion(event));
};
