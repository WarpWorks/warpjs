import * as actionCreators from './action-creators';
import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('orchestrators');

export const show = async (dispatch, url) => {
    debug(`called...`);
    await window.WarpJS.ReactComponents.showModalContainer(dispatch, NAME);

    try {
        const result = await window.WarpJS.proxy.get($, url, true);
        debug(`result=`, result);
    } catch (err) {
        console.error(`Error fetching user notifications:`, err);
        dispatch(actionCreators.error(`Error fetching user notifications`, err));
    }
};
