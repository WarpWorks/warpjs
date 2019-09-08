import { NAME } from './constants';

const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;

export const orchestrators = Object.freeze({
    hideModal: async (dispatch) => hideModalContainer(dispatch, NAME),
    showModal: async (dispatch) => {
        console.log("showModal"); showModalContainer(dispatch, NAME);
    }
});
