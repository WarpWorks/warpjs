import { NAME } from './constants';

import _debug from './debug'; const debug = _debug('orchestrators');

export const show = async (dispatch, url) => {
    await window.WarpJS.ReactComponents.showModalContainer(dispatch, NAME);

    const result = await window.WarpJS.proxy.get($, url, true);
    debug(`result=`, result);
};
