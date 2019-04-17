import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('orchestrators');

export const show = async (dispatch) => {
    await window.WarpJS.ReactComponents.showModalContainer(dispatch, NAME);
};
