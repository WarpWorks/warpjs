import * as actionCreators from './action-creators';
import { NAME } from './constants';

// import _debug from './debug'; const debug = _debug('orchestrators');

const { proxy } = window.WarpJS;
const { showModalContainer } = window.WarpJS.ReactComponents;

export const show = async (dispatch, url) => {
    await showModalContainer(dispatch, NAME);

    try {
        const result = await proxy.get($, url, true);
        if (result && result._embedded && result._embedded.documents) {
            dispatch(actionCreators.results(result._embedded.documents));
        } else {
            dispatch(actionCreators.error(`Invalid response format`, {
                message: `Could not find result._embedded.documents`
            }));
        }
    } catch (err) {
        console.error(`Error fetching user documents:`, err);
        dispatch(actionCreators.error(`Error fetching user documents`, err));
    }
};
