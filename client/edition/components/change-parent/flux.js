import { NAME } from './constants';
import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { proxy } = window.WarpJS;
const { actionCreator, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;
const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;

export const actions = namespaceKeys(namespace, [
    'ERROR',
    'SET_INSTANCE',
    'SET_TYPE',
    'TYPES',
    'INSTANCES'
]);

//
//  Orchestrators
//

export const actionCreators = Object.freeze({
    error: (message) => actionCreator(actions.ERROR, { message }),
    instances: (type, items) => actionCreator(actions.INSTANCES, { type, items }),
    setInstance: (id) => actionCreator(actions.SET_INSTANCE, { id }),
    setType: (type) => actionCreator(actions.SET_TYPE, { type }),
    types: (items) => actionCreator(actions.TYPES, { items })
});

export const orchestrators = Object.freeze({
    getInstances: async (dispatch, type, url) => {
        dispatch(actionCreators.setType(type));
        dispatch(actionCreators.setInstance(null));
        dispatch(actionCreators.instances(type, null));
        try {
            const res = await proxy.get($, url);
            dispatch(actionCreators.instances(type, res._embedded.items));

            const currentlySelected = res._embedded.items.find((item) => item.selected);
            dispatch(actionCreators.setInstance(currentlySelected ? currentlySelected.id : null));
        } catch (err) {
            console.error(`Error proxy.get(${url}):`, err);
            dispatch(actionCreators.error(`Cannot load instances.`));
        }
    },
    hideModal: async (dispatch) => hideModalContainer(dispatch, NAME),
    initTypes: async (dispatch, url) => {
        try {
            const res = await proxy.get($, url, true);
            dispatch(actionCreators.types(res._embedded.items));

            const currentlySelected = res._embedded.items.find((item) => item.selected);
            if (currentlySelected) {
                orchestrators.getInstances(dispatch, currentlySelected.name, currentlySelected._links.self.href);
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error proxy.get(${url}):`, err);
            dispatch(actionCreators.error(`Cannot load types.`));
        }
    },
    selectInstance: async (dispatch, instance) => {
        debug(`selectInstance(): instance=`, instance);
    },
    selectType: async (dispatch, type) => {
        orchestrators.getInstances(dispatch, type.name, type._links.self.href);
    },
    showModal: async (dispatch, url) => {
        dispatch(actionCreators.types(null));
        dispatch(actionCreators.instances(null, null));
        showModalContainer(dispatch, NAME);
        orchestrators.initTypes(dispatch, url);
    }
});

//
//  Reducers
//

const error = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.error = action.payload.message;
    return setNamespaceSubstate(state, namespace, substate);
};

const instances = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    if (action.payload.type) {
        if (!substate.instances) {
            substate.instances = {};
        }

        substate.instances[action.payload.type] = action.payload.items;
    } else {
        substate.instances = {};
    }
    return setNamespaceSubstate(state, namespace, substate);
};

const setInstance = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.selectedInstance = action.payload.id;
    return setNamespaceSubstate(state, namespace, substate);
};

const setType = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.selectedType = action.payload.type;
    return setNamespaceSubstate(state, namespace, substate);
};

const types = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.types = action.payload.items;
    return setNamespaceSubstate(state, namespace, substate);
};

export const reducers = concatenateReducers([
    { actions: [ actions.ERROR ], reducer: error },
    { actions: [ actions.INSTANCES ], reducer: instances },
    { actions: [ actions.SET_INSTANCE ], reducer: setInstance },
    { actions: [ actions.SET_TYPE ], reducer: setType },
    { actions: [ actions.TYPES ], reducer: types }
]);
