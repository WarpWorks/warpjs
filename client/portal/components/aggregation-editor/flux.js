import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('flux');

const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;

export const orchestrators = Object.freeze({
    hideModal: async (dispatch) => hideModalContainer(dispatch, NAME),
    showModal: (dispatch, event) => {
        event.stopPropagation();
        showModalContainer(dispatch, NAME);
    }
});
