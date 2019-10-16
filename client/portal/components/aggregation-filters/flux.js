import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('flux');

const { actionCreator, /* baseAttributeReducer, */ concatenateReducers, getNamespaceSubstate, namespaceKeys, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'SET_SELECTION'
]);

const actionCreators = Object.freeze({
    select: (relnId, entityId, firstLevelId, secondLevelId) => actionCreator(actions.SET_SELECTION, { relnId, entityId, firstLevelId, secondLevelId })
});

export const orchestrators = Object.freeze({
    select: async (dispatch, selected, relnId, entityId, firstLevelId, secondLevelId) => {
        if (selected) {
            dispatch(actionCreators.select(relnId, entityId, firstLevelId, secondLevelId));
        } else if (secondLevelId) {
            dispatch(actionCreators.select(relnId, entityId, firstLevelId));
        } else {
            dispatch(actionCreators.select());
        }
    }
});

export const reducers = concatenateReducers([{
    actions: [ actions.SET_SELECTION ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);
        substate.selection = action.payload;
        return setNamespaceSubstate(state, namespace, substate);
    }
}]);
