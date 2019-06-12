import * as actionCreators from './action-creators';
import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('orchestrators');

export const createVersion = async (dispatch, url, nextVersion) => {
    debug(`createVersion(): url=${url}; nextVersion=${nextVersion}`);
    const toastLoading = await window.WarpJS.toast.loading($, `Creating version '${nextVersion}'...`, "Creating...");
    try {
        const res = await window.WarpJS.proxy.post($, url, { nextVersion });
        debug(`res=`, res);
        await window.WarpJS.toast.success($, "Done");
        window.location.href = res._links.newVersion.href;
    } catch (err) {
        await window.WarpJS.toast.error($, err.message, `Error creating version '${nextVersion}'`)
    } finally {
        window.WarpJS.toast.close($, toastLoading);
    }
};

export const hideModal = async (dispatch) => {
    await window.WarpJS.ReactComponents.hideModalContainer(dispatch, NAME);
    resetVersion(dispatch);
};

export const resetVersion = (dispatch) => {
    dispatch(actionCreators.resetVersion());
};

export const showModal = async (dispatch, url) => {
    await window.WarpJS.ReactComponents.showModalContainer(dispatch, NAME);
};

export const updateVersion = (dispatch, event) => {
    dispatch(actionCreators.updateVersion(event));
};
