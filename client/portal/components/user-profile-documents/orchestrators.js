import * as actionCreators from './action-creators';
import { NAME } from './constants';
import { initialize as contentInitialize } from './components/content';

// import _debug from './debug'; const debug = _debug('orchestrators');

export const show = async (dispatch, url) => {
    await window.WarpJS.ReactComponents.showModalContainer(dispatch, NAME);

    try {
        const result = await window.WarpJS.proxy.get($, url, true);
        if (result && result._embedded && result._embedded.documents) {
            dispatch(actionCreators.results(result._embedded.documents));
            await contentInitialize(dispatch);
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
