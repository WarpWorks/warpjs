import * as actionCreators from './action-creators';
import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('orchestrators');

export const show = async (dispatch, url) => {
    await window.WarpJS.ReactComponents.showModalContainer(dispatch, NAME);

    try {
        const result = await window.WarpJS.proxy.get($, url, true);
        if (result && result._embedded && result._embedded.notifications) {
            dispatch(actionCreators.results(result._embedded.notifications));
        } else {
            dispatch(actionCreators.error(`Invalid response format`, {
                message: `Could not find result._embedded.notifications`
            }));
        }
    } catch (err) {
        console.error(`Error fetching user notifications:`, err);
        dispatch(actionCreators.error(`Error fetching user notifications`, err));
    }
};

export const showDetails = async (dispatch, type, id) => {
    dispatch(actionCreators.showDetails(type, id));
};

export const hideDetails = async (dispatch) => {
    dispatch(actionCreators.hideDetails());
};

export const resetModal = async (dispatch) => {
    dispatch(actionCreators.resetModal());
};
