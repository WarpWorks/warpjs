import { NAME } from './constants';
import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { proxy, toast } = window.WarpJS;
const { showModalContainer } = window.WarpJS.ReactComponents;
const { actionCreator, baseAttributeReducer, concatenateReducers, namespaceKeys } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'ERROR',
    'SET_ITEMS'
]);

const actionCreators = Object.freeze({
    error: (message) => actionCreator(actions.ERROR, { message }),
    setItems: (items) => actionCreator(actions.SET_ITEMS, { items })
});

export const orchestrators = Object.freeze({
    createChild: async(dispatch, url) => {
        const toastLoading = toast.loading($, "Creating new child");
        try {
            const res = await proxy.post($, url);
            debug(`res=`, res);
        } catch (err) {
            debug(`err=`, err);
            toast.error($, "Unable to create new child");
        } finally {
            toast.close($, toastLoading);
        }
    },
    showModal: async (dispatch, url) => {
        dispatch(actionCreators.setItems(null));
        showModalContainer(dispatch, NAME);
        try {
            const res = await proxy.get($, url, true);
            dispatch(actionCreators.setItems(res._embedded.items));
        } catch (err) {
            dispatch(actionCreators.error(`Cannot fetch document aggregation.`));
        }
    }
});

const error = (state = {}, action) => baseAttributeReducer(state, namespace, 'error', action.payload.message);
const setItems = (state = {}, action) => baseAttributeReducer(state, namespace, 'items', action.payload.items);

export const reducers = concatenateReducers([
    { actions: [ actions.ERROR ], reducer: error },
    { actions: [ actions.SET_ITEMS ], reducer: setItems }
]);
