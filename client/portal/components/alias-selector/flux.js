import namespace from './namespace';
import pageHalNamespace from './../page-hal/namespace';
import aliasNameValidator from './../../../../lib/core/validators/alias-name';

// import _debug from './debug'; const debug = _debug('flux');

const { batch } = window.WarpJS.ReactUtils;
const { actionCreator, baseAttributeReducer, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;
const { proxy, toast } = window.WarpJS;

//
//  Actions
//
const actions = namespaceKeys(namespace, [
    'ENABLE_ACTION_BUTTON',
    'SET_ALIASES',
    'TOGGLE_EDIT_MODE',
    'UPDATE_ALIAS',
    'UPDATE_EDIT_VALUE',
    'UPDATE_EDIT_VALUE_STATE',
    'UPDATE_PAGE_ALIAS',
    'VALUE_MESSAGE'
]);

//
//  Action creators
//
const actionCreators = Object.freeze({
    enableActionButton: (value) => actionCreator(actions.ENABLE_ACTION_BUTTON, { value }),
    setListOfExistingAliases: (items) => actionCreator(actions.SET_ALIASES, { items }),
    toggleEditMode: (value) => actionCreator(actions.TOGGLE_EDIT_MODE, { value }),
    updateAlias: (value) => actionCreator(actions.UPDATE_ALIAS, { value }),
    updateEditValue: (value) => actionCreator(actions.UPDATE_EDIT_VALUE, { value }),
    updateEditValueState: (value) => actionCreator(actions.UPDATE_EDIT_VALUE_STATE, { value }),
    updatePageAlias: (value) => actionCreator(actions.UPDATE_PAGE_ALIAS, { value }),
    valueMessage: (value) => actionCreator(actions.VALUE_MESSAGE, { value })
});

//
//  Orchestrators
//
export const orchestrators = Object.freeze({
    createAlias: async (dispatch, url, value, setDirty) => {
        batch(() => {
            dispatch(actionCreators.enableActionButton(false));
            dispatch(actionCreators.valueMessage(null));
            dispatch(actionCreators.updateEditValueState('warning'));
        });

        const toastLoading = toast.loading($, "Creating...");
        try {
            await proxy.post($, url, { value });
            batch(() => {
                orchestrators.unsetEditMode(dispatch);
                dispatch(actionCreators.updatePageAlias(value));
                setDirty(dispatch);
            });
        } catch (err) {
            console.error(`orchestrators.createAlias(): err=`, err);
            toast.error($, "Unable to create alias");
            dispatch(actionCreators.updateEditValueState('error'));
            setTimeout(
                () => {
                    batch(() => {
                        dispatch(actionCreators.updateEditValueState('warning'));
                        dispatch(actionCreators.valueMessage(null));
                        dispatch(actionCreators.enableActionButton(true));
                    });
                },
                2000
            );
        } finally {
            toast.close($, toastLoading);
        }
    },
    renameAlias: async (dispatch, url, value, setDirty) => {
        batch(() => {
            dispatch(actionCreators.enableActionButton(false));
            dispatch(actionCreators.valueMessage(null));
            dispatch(actionCreators.updateEditValueState('warning'));
        });

        const toastLoading = toast.loading($, "Renaming...");
        try {
            await proxy.patch($, url, { value });
            batch(() => {
                orchestrators.unsetEditMode(dispatch);
                dispatch(actionCreators.updatePageAlias(value));
                setDirty(dispatch);
            });
        } catch (err) {
            toast.error($, "Unable to rename alias");
            dispatch(actionCreators.updateEditValueState('error'));
            setTimeout(
                () => {
                    batch(() => {
                        dispatch(actionCreators.updateEditValueState('warning'));
                        dispatch(actionCreators.valueMessage(null));
                        dispatch(actionCreators.enableActionButton(true));
                    });
                },
                2000
            );
        } finally {
            toast.close($, toastLoading);
        }
    },
    setEditMode: async (dispatch, url) => {
        dispatch(actionCreators.toggleEditMode(true));
        dispatch(actionCreators.enableActionButton(false));
        dispatch(actionCreators.valueMessage(null));
        try {
            const res = await proxy.get($, url, true);
            dispatch(actionCreators.setListOfExistingAliases(res.items));
        } catch (err) {
            console.error(`error proxy.get(): err=`, err);
        }
    },
    unsetEditMode: (dispatch) => {
        dispatch(actionCreators.toggleEditMode(false));
        dispatch(actionCreators.updateEditValueState(null));
        dispatch(actionCreators.updateEditValue(null));
    },
    updateAlias: (dispatch, value) => dispatch(actionCreators.updateAlias(value)),
    updateEditValue: (dispatch, value, aliases, currentValue) => {
        batch(() => {
            dispatch(actionCreators.enableActionButton(false));
            dispatch(actionCreators.updateEditValueState('warning'));
            dispatch(actionCreators.updateEditValue(value));
            dispatch(actionCreators.valueMessage(null));

            if (aliasNameValidator(value)) {
                if (aliases.indexOf(value) === -1) {
                    dispatch(actionCreators.enableActionButton(true));
                } else if (value === currentValue) {
                    dispatch(actionCreators.updateEditValueState(null));
                } else {
                    dispatch(actionCreators.valueMessage("The alias is already in use."));
                    dispatch(actionCreators.updateEditValueState('error'));
                }
            } else {
                dispatch(actionCreators.valueMessage("Invalid alias. Use A-Z, a-z, 0-9, or dash ('-') only."));
                dispatch(actionCreators.updateEditValueState('error'));
            }
        });
    }
});

//
//  Reducers
//
export const reducers = concatenateReducers([{
    actions: [ actions.ENABLE_ACTION_BUTTON ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'actionButtonEnabled', action.payload.value)
}, {
    actions: [ actions.SET_ALIASES ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'aliases', action.payload.items)
}, {
    actions: [ actions.TOGGLE_EDIT_MODE ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'inEditMode', action.payload.value || false)
}, {
    actions: [ actions.UPDATE_EDIT_VALUE ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'editValue', action.payload.value)
}, {
    actions: [ actions.UPDATE_EDIT_VALUE_STATE ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'editValueState', action.payload.value)
}, {
    actions: [ actions.UPDATE_PAGE_ALIAS ],
    reducer: (state = {}, action) => {
        const pageHalSubstate = getNamespaceSubstate(state, pageHalNamespace);
        const page = pageHalSubstate.pages[0];
        page.aliases = page.aliases || [{}];
        const alias = page.aliases[0];
        alias.name = action.payload.value;
        return setNamespaceSubstate(state, pageHalNamespace, pageHalSubstate);
    }
}, {
    actions: [ actions.VALUE_MESSAGE ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'valueMessage', action.payload.value)
}]);
