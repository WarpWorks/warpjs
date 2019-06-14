import { NAME } from './constants';
import namespace from './namespace';

import _debug from './debug'; const debug = _debug('flux');

const { actionCreator, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;
const { hideModalContainer, showModalContainer } = window.WarpJS.ReactComponents;

export const actions = namespaceKeys(namespace, [
    'UPDATE_VALUE',
]);

export const actionCreators = Object.freeze({
    updateValue: (key, value) => actionCreator(actions.UPDATE_VALUE, { key, value })
});

//
//  Orchestrators
//

const { proxy, toast } = window.WarpJS;

export const orchestrators = Object.freeze({
    hideModal: async (dispatch) => hideModalContainer(dispatch, NAME),
    saveValue: async (dispatch, url, key, value) => {
        debug(`orchestrators.saveValue(): url=${url}, key=${key}, value=${value}`);
        const toastLoading = toast.loading($, "Saving...");
        try {
            await proxy.patch($, url, { key, value });
            toast.success($, "Saved");
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`Error saveValue(url=${url}, key=${key}, value=${value}): err=`, err);
            toast.error($, err.message, "Save error!");
            throw err;
        } finally {
            toast.close($, toastLoading);
        }
    },
    showModal: async (dispatch) => showModalContainer(dispatch, NAME),
    updateValue: async (dispatch, key, value) => dispatch(actionCreators.updateValue(key, value))
});

//
//  Reducers
//

const updateValue = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.editedValues = substate.editedValues || {};
    substate.editedValues[action.payload.key] = action.payload.value;
    return setNamespaceSubstate(state, namespace, substate);
};

export const reducers = concatenateReducers([
    { actions: [ actions.UPDATE_VALUE ], reducer: updateValue }
]);
