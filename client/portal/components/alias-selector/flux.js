import namespace from './namespace';

const { actionCreator, concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

//
//  Actions
//
const actions = namespaceKeys(namespace, [
    'UPDATE_EDIT_MODE'
]);

//
//  Action creators
//
const actionCreators = Object.freeze({
    setEditMode: () => actionCreator(actions.UPDATE_EDIT_MODE, { value: true }),
    unsetEditMode: () => actionCreator(actions.UPDATE_EDIT_MODE, { value: false })
});

//
//  Orchestrators
//
export const orchestrators = Object.freeze({
    setEditMode: (dispatch) => dispatch(actionCreators.setEditMode()),
    unsetEditMode: (dispatch) => dispatch(actionCreators.unsetEditMode())
});

//
//  Reducers
//
const updateEditMode = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.inEditMode = action.payload.value || false;
    return setNamespaceSubstate(state, namespace, substate);
};

export const reducers = concatenateReducers([
    { actions: [ actions.UPDATE_EDIT_MODE ], reducer: updateEditMode }
]);
