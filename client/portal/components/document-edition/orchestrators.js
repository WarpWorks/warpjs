// import * as actionCreators from './action-creators';
import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('orchestrators');

export const hideModal = async (dispatch) => {
    await window.WarpJS.ReactComponents.hideModalContainer(dispatch, NAME);
};

export const showModal = async (dispatch) => {
    await window.WarpJS.ReactComponents.showModalContainer(dispatch, NAME);
};

