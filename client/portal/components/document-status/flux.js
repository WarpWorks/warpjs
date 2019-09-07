import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('flux');

const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;

//
//  Orchestrators
//

export const orchestrators = Object.freeze({
    hideModal: async (dispatch) => hideModalContainer(dispatch, NAME),
    showModal: async (dispatch) => showModalContainer(dispatch, NAME)
});
