import { orchestrators as pageHalOrchestrators } from './../page-hal';

import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { proxy, toast } = window.WarpJS;
const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;
const { batch } = window.WarpJS.ReactUtils;
const { actionCreator, baseAttributeReducer, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'RESET_SHOW_FILTERS',
    'SET_AGGREGATION_FILTERS',
    'SET_ASSOCIATIONS',
    'SET_ENTITIES',
    'SET_ERROR',
    'SET_ITEMS',
    'SET_URL',
    'TOGGLE_FILTERS',
    'UPDATE_FILTER_LABEL'
]);

const actionCreators = Object.freeze({
    resetShowFilter: () => actionCreator(actions.RESET_SHOW_FILTERS),
    setAggregationFilters: (aggregationFilters) => actionCreator(actions.SET_AGGREGATION_FILTERS, { aggregationFilters }),
    setAssociations: (associations) => actionCreator(actions.SET_ASSOCIATIONS, { associations }),
    setEntities: (entities) => actionCreator(actions.SET_ENTITIES, { entities }),
    setError: (message) => actionCreator(actions.SET_ERROR, { message }),
    setItems: (items) => actionCreator(actions.SET_ITEMS, { items }),
    setUrl: (url) => actionCreator(actions.SET_URL, { url }),
    toggleFilters: () => actionCreator(actions.TOGGLE_FILTERS),
    updateFilterLabel: (association, label) => actionCreator(actions.UPDATE_FILTER_LABEL, { association, label })
});

export const orchestrators = Object.freeze({
    addFilter: async (dispatch, association, setDirty) => {
        const toastLoading = toast.loading($, "Adding filter");
        try {
            const data = { id: association.id };
            const url = association.relationships[0].url;
            const res = await proxy.post($, url, data);
            batch(() => {
                dispatch(actionCreators.setAggregationFilters(res._embedded.aggregationFilters || []));
                setDirty(dispatch);
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`orchestrators.addFilter(): err=`, err);
            toast.error($, "Unable to add filter!");
        } finally {
            toast.close($, toastLoading);
        }
    },

    closeModal: async (dispatch, id, isDirty) => {
        batch(() => {
            hideModalContainer(dispatch, id, isDirty);
            orchestrators.modalClosed(dispatch, isDirty);
        });
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

    modalClosed: async (dispatch, isDirty) => pageHalOrchestrators.refreshPage(dispatch, isDirty),

    removeDocument: async (dispatch, item) => {
        debug(`orchestrators.removeDocument(): item=`, item);
    },

    removeFilter: async (dispatch, association, setDirty) => {
        const toastLoading = toast.loading($, "Removing filter");
        try {
            const data = { id: association.id };
            const url = association.relationships[0].url;
            const res = await proxy.del($, url, data);
            batch(() => {
                dispatch(actionCreators.setAggregationFilters(res._embedded.aggregationFilters || []));
                setDirty(dispatch);
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`orchestrators.removeFilter(): err=`, err);
            toast.error($, "Unable to remove filter!");
        } finally {
            toast.close($, toastLoading);
        }
    },

    showModal: async (dispatch, id, url) => {
        batch(() => {
            dispatch(actionCreators.resetShowFilter());
            dispatch(actionCreators.setError(null));
            dispatch(actionCreators.setItems(null));
            dispatch(actionCreators.setEntities(null));
            dispatch(actionCreators.setAssociations(null));
            dispatch(actionCreators.setAggregationFilters(null));
        });

        showModalContainer(dispatch, id);
        try {
            const res = await proxy.get($, url, true);
            batch(() => {
                dispatch(actionCreators.setItems(res._embedded.items || []));
                dispatch(actionCreators.setEntities(res._embedded.entities || []));
                dispatch(actionCreators.setAssociations(res._embedded.associations || []));
                dispatch(actionCreators.setAggregationFilters(res._embedded.aggregationFilters || []));
                dispatch(actionCreators.setUrl(url));
            });
        } catch (err) {
            dispatch(actionCreators.setError(`Cannot fetch document aggregation.`));
        }
    },

    toggleFilters: (dispatch) => {
        dispatch(actionCreators.toggleFilters());
    },

    updateFilterLabel: async (dispatch, association, label, setDirty) => {
        batch(() => {
            dispatch(actionCreators.updateFilterLabel(association, label));
            setDirty(dispatch);
        });
    },

    updateFilterValue: async (dispatch, association, key, value, setDirty) => {
        const toastLoading = toast.loading($, `Update ${key}=${value}`);
        try {
            const data = { id: association.id, key, value };
            const url = association.relationships[0].url;
            const res = await proxy.patch($, url, data);
            batch(() => {
                dispatch(actionCreators.setAggregationFilters(res._embedded.aggregationFilters || []));
                setDirty(dispatch);
            });
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`orchestrators.updateFilterValue(): err=`, err);
            toast.error($, `Unable to update ${key}=${value}!`);
        } finally {
            toast.close($, toastLoading);
        }
    }

});

export const reducers = concatenateReducers([{
    actions: [ actions.RESET_SHOW_FILTERS ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'showFilters', false)
}, {
    actions: [ actions.SET_AGGREGATION_FILTERS ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'aggregationFilters', action.payload.aggregationFilters)
}, {
    actions: [ actions.SET_ASSOCIATIONS ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'associations', action.payload.associations)
}, {
    actions: [ actions.SET_ENTITIES ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'entities', action.payload.entities)
}, {
    actions: [ actions.SET_ERROR ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'error', action.payload.message)
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
}, {
    actions: [ actions.UPDATE_FILTER_LABEL ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);

        const aggregationFilter = substate.aggregationFilters.find((filter) => filter.id === action.payload.association.id);
        aggregationFilter.editLabel = action.payload.label;

        return setNamespaceSubstate(state, namespace, substate);
    }
}]);
