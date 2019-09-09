import { NAME } from './constants';
import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { proxy } = window.WarpJS;
const { actionCreator, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;
const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;

export const actions = namespaceKeys(namespace, [
    'ERROR',
    'TYPES'
]);

//
//  Orchestrators
//

export const actionCreators = Object.freeze({
    error: (message) => actionCreator(actions.ERROR, { message }),
    types: (items) => actionCreator(actions.TYPES, { items })
});

export const orchestrators = Object.freeze({
    getInstances: async (dispatch, url) => {
        try {
            const res = await proxy.get($, url);
            debug(`getInstances(): res=`, res);
        } catch (err) {
            console.error(`Error proxy.get(${url}):`, err);
            dispatch(actionCreators.error(`Cannot load instances.`));
        }
    },
    hideModal: async (dispatch) => hideModalContainer(dispatch, NAME),
    showModal: async (dispatch, url) => {
        showModalContainer(dispatch, NAME);
        try {
            const res = await proxy.get($, url);
            dispatch(actionCreators.types(res._embedded.items));

            const currentlySelected = res._embedded.items.find((item) => item.selected);
            if (currentlySelected) {
                orchestrators.getInstances(dispatch, currentlySelected._links.self.href);
            }
        } catch (err) {
            console.error(`Error proxy.get(${url}):`, err);
            dispatch(actionCreators.error(`Cannot load types.`));
        }
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

const types = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.types = action.payload.items;
    return setNamespaceSubstate(state, namespace, substate);
};

export const reducers = concatenateReducers([
    { actions: [ actions.ERROR ], reducer: error },
    { actions: [ actions.TYPES ], reducer: types }
]);
