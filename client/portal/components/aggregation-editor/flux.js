import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { proxy, toast } = window.WarpJS;
const { showModalContainer } = window.WarpJS.ReactComponents;
const { actionCreator, baseAttributeReducer, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'ERROR',
    'SET_AGGREGATION_FILTERS',
    'SET_ASSOCIATIONS',
    'SET_DIRTY',
    'SET_ENTITIES',
    'SET_ITEMS',
    'SET_URL',
    'TOGGLE_FILTERS'
]);

const actionCreators = Object.freeze({
    error: (message) => actionCreator(actions.ERROR, { message }),
    setAggregationFilters: (aggregationFilters) => actionCreator(actions.SET_AGGREGATION_FILTERS, { aggregationFilters }),
    setAssociations: (associations) => actionCreator(actions.SET_ASSOCIATIONS, { associations }),
    setDirty: (dirty) => actionCreator(actions.SET_DIRTY, { dirty }),
    setEntities: (entities) => actionCreator(actions.SET_ENTITIES, { entities }),
    setItems: (items) => actionCreator(actions.SET_ITEMS, { items }),
    setUrl: (url) => actionCreator(actions.SET_URL, { url }),
    toggleFilters: () => actionCreator(actions.TOGGLE_FILTERS)
});

export const orchestrators = Object.freeze({
    addFilter: async (dispatch, association) => {
        debug(`orchestrators.addFilter(): association=`, association);
        const toastLoading = toast.loading($, "Adding filter");
        try {
            const data = { id: association.id };
            const url = association.relationships[0].url;
            await proxy.post($, url, data);
            orchestrators.setDirty(dispatch);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`orchestrators.addFilter(): err=`, err);
            toast.error($, "Unable to add filter!");
        } finally {
            toast.close($, toastLoading);
        }
    },

    createChild: async(dispatch, url, entity) => {
        const toastLoading = toast.loading($, "Creating new child");
        try {
            const res = await proxy.post($, url, { entity });
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
    modalClosed: async (dispatch, isDirty) => {
        if (isDirty) {
            toast.loading($, "Refreshing page");
            setTimeout(() => document.location.reload(), 1500);
        }
    },
    removeDocument: async (dispatch, item) => {
        debug(`orchestrators.removeDocument(): item=`, item);
    },
    setDirty: (dispatch) => {
        dispatch(actionCreators.setDirty(true));
    },
    showModal: async (dispatch, id, url) => {
        dispatch(actionCreators.setDirty(false));
        dispatch(actionCreators.setItems(null));
        dispatch(actionCreators.setEntities(null));
        dispatch(actionCreators.setAssociations(null));
        dispatch(actionCreators.setAggregationFilters(null));
        showModalContainer(dispatch, id);
        try {
            const res = await proxy.get($, url, true);
            dispatch(actionCreators.setItems(res._embedded.items || []));
            dispatch(actionCreators.setEntities(res._embedded.entities || []));
            dispatch(actionCreators.setAssociations(res._embedded.associations || []));
            dispatch(actionCreators.setAggregationFilters(res._embedded.aggregationFilters || []));
            dispatch(actionCreators.setUrl(url));
        } catch (err) {
            dispatch(actionCreators.error(`Cannot fetch document aggregation.`));
        }
    },
    toggleFilters: (dispatch) => {
        dispatch(actionCreators.toggleFilters());
    }
});

export const reducers = concatenateReducers([{
    actions: [ actions.ERROR ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'error', action.payload.message)
}, {
    actions: [ actions.SET_AGGREGATION_FILTERS ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'aggregationFilters', action.payload.aggregationFilters)
}, {
    actions: [ actions.SET_ASSOCIATIONS ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'associations', action.payload.associations)
}, {
    actions: [ actions.SET_DIRTY ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'isDirty', action.payload.dirty)
}, {
    actions: [ actions.SET_ENTITIES ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'entities', action.payload.entities)
}, {
    actions: [ actions.SET_ITEMS ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'items', action.payload.items)
}, {
    actions: [ actions.SET_URL ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'url', action.payload.url)
}, {
    actions: [ actions.TOGGLE_FILTERS ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);
        substate.showFilters = !substate.showFilters;
        return setNamespaceSubstate(state, namespace, substate);
    }
}]);
