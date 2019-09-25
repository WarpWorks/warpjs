import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { proxy, toast } = window.WarpJS;
const { showModalContainer } = window.WarpJS.ReactComponents;
const { actionCreator, baseAttributeReducer, concatenateReducers, namespaceKeys } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'ERROR',
    'SET_ENTITIES',
    'SET_ITEMS',
    'SET_URL'
]);

const actionCreators = Object.freeze({
    error: (message) => actionCreator(actions.ERROR, { message }),
    setEntities: (entities) => actionCreator(actions.SET_ENTITIES, { entities }),
    setItems: (items) => actionCreator(actions.SET_ITEMS, { items }),
    setUrl: (url) => actionCreator(actions.SET_URL, { url })
});

export const orchestrators = Object.freeze({
    createChild: async(dispatch, url, entity) => {
        const toastLoading = toast.loading($, "Creating new child");
        try {
            const res = await proxy.post($, url, { entity });
            debug(`res=`, res);
        } catch (err) {
            debug(`err=`, err);
            toast.error($, "Unable to create new child");
        } finally {
            toast.close($, toastLoading);
        }
    },
    showModal: async (dispatch, id, url) => {
        dispatch(actionCreators.setItems(null));
        dispatch(actionCreators.setEntities(null));
        showModalContainer(dispatch, id);
        try {
            const res = await proxy.get($, url, true);
            dispatch(actionCreators.setItems(res._embedded.items || []));
            dispatch(actionCreators.setEntities(res._embedded.entities || []));
            dispatch(actionCreators.setUrl(url));
        } catch (err) {
            dispatch(actionCreators.error(`Cannot fetch document aggregation.`));
        }
    }
});

const error = (state = {}, action) => baseAttributeReducer(state, namespace, 'error', action.payload.message);
const setEntities = (state = {}, action) => baseAttributeReducer(state, namespace, 'entities', action.payload.entities);
const setItems = (state = {}, action) => baseAttributeReducer(state, namespace, 'items', action.payload.items);
const setUrl = (state = {}, action) => baseAttributeReducer(state, namespace, 'url', action.payload.url);

export const reducers = concatenateReducers([
    { actions: [ actions.ERROR ], reducer: error },
    { actions: [ actions.SET_ENTITIES ], reducer: setEntities },
    { actions: [ actions.SET_ITEMS ], reducer: setItems },
    { actions: [ actions.SET_URL ], reducer: setUrl }
]);
