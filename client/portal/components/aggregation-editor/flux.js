import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { proxy, toast } = window.WarpJS;
const { showModalContainer } = window.WarpJS.ReactComponents;
const { actionCreator, baseAttributeReducer, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'ERROR',
    'SET_ENTITIES',
    'SET_ITEMS',
    'SET_URL',
    'TOGGLE_FILTERS'
]);

const actionCreators = Object.freeze({
    error: (message) => actionCreator(actions.ERROR, { message }),
    setEntities: (entities) => actionCreator(actions.SET_ENTITIES, { entities }),
    setItems: (items) => actionCreator(actions.SET_ITEMS, { items }),
    setUrl: (url) => actionCreator(actions.SET_URL, { url }),
    toggleFilters: () => actionCreator(actions.TOGGLE_FILTERS)
});

export const orchestrators = Object.freeze({
    createChild: async(dispatch, url, entity) => {
        const toastLoading = toast.loading($, "Creating new child");
        try {
            const res = await proxy.post($, url, { entity });
            debug(`res=`, res);
            if (res && res._links && res._links.newChildPortal) {
                document.location.href = res._links.newChildPortal.href;
            } else {
                throw new Error(`Cannot find link for new ${entity} document.`);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`orchestrators.createChild(): err=`, err);
            toast.error($, "Unable to create new child");
        } finally {
            toast.close($, toastLoading);
        }
    },
    goToPortal: async (dispatch, item) => {
        document.location.href = item._links.portal.href;
    },
    removeDocument: async (dispatch, item) => {
        debug(`orchestrators.removeDocument(): item=`, item);
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
    },
    toggleFilters: (dispatch) => {
        dispatch(actionCreators.toggleFilters());
    }
});

const error = (state = {}, action) => baseAttributeReducer(state, namespace, 'error', action.payload.message);
const setEntities = (state = {}, action) => baseAttributeReducer(state, namespace, 'entities', action.payload.entities);
const setItems = (state = {}, action) => baseAttributeReducer(state, namespace, 'items', action.payload.items);
const setUrl = (state = {}, action) => baseAttributeReducer(state, namespace, 'url', action.payload.url);

const toggleFilters = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.showFilters = !substate.showFilters;
    return setNamespaceSubstate(state, namespace, substate);
};

export const reducers = concatenateReducers([
    { actions: [ actions.ERROR ], reducer: error },
    { actions: [ actions.SET_ENTITIES ], reducer: setEntities },
    { actions: [ actions.SET_ITEMS ], reducer: setItems },
    { actions: [ actions.SET_URL ], reducer: setUrl },
    { actions: [ actions.TOGGLE_FILTERS ], reducer: toggleFilters }
]);
