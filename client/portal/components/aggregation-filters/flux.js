import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('flux');

const { batch } = window.WarpJS.ReactUtils;
const { actionCreator, baseAttributeReducer, concatenateReducers, namespaceKeys } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'SET_SELECTION',
    'SET_SEARCH_VALUE'
]);

const actionCreators = Object.freeze({
    select: (relnId, entityId, firstLevelId, secondLevelId) => actionCreator(actions.SET_SELECTION, { relnId, entityId, firstLevelId, secondLevelId }),
    setSearchValue: (value) => actionCreator(actions.SET_SEARCH_VALUE, { value })
});

export const orchestrators = Object.freeze({
    clearSearchValue: (dispatch) => {
        batch(() => {
            orchestrators.setSearchValue(dispatch, '');
        });
    },
    select: async (dispatch, selected, relnId, entityId, firstLevelId, secondLevelId) => {
        batch(() => {
            if (selected) {
                dispatch(actionCreators.select(relnId, entityId, firstLevelId, secondLevelId));
            } else if (secondLevelId) {
                dispatch(actionCreators.select(relnId, entityId, firstLevelId));
            } else {
                dispatch(actionCreators.select());
            }
        });
    },
    setSearchValue: (dispatch, value) => {
        batch(() => {
            dispatch(actionCreators.setSearchValue(value));
        });
    }
});

export const reducers = concatenateReducers([{
    actions: [ actions.SET_SELECTION ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'selection', action.payload)
}, {
    actions: [ actions.SET_SEARCH_VALUE ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'searchValue', action.payload.value)
}]);
