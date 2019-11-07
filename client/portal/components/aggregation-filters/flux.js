import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('flux');

const { batch } = window.WarpJS.ReactUtils;
const { actionCreator, concatenateReducers, getNamespaceAttribute, getNamespaceSubstate, namespaceKeys, setNamespaceAttribute, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const actions = namespaceKeys(namespace, [
    'SET_SELECTION',
    'SET_SEARCH_VALUE',
    'SET_SHOWING_ALL'
]);

const actionCreators = Object.freeze({
    select: (relnId, entityId, firstLevelId, secondLevelId) => actionCreator(actions.SET_SELECTION, { relnId, entityId, firstLevelId, secondLevelId }),
    setSearchValue: (value) => actionCreator(actions.SET_SEARCH_VALUE, { value }),
    showAll: (relnId, entityId, showAll) => actionCreator(actions.SET_SHOWING_ALL, { relnId, entityId, showAll })
});

export const orchestrators = Object.freeze({
    clearSearchValue: (dispatch) => {
        batch(() => {
            orchestrators.setSearchValue(dispatch, '');
        });
    },
    select: async (dispatch, selected, relnId, entityId, firstLevelId, secondLevelId) => {
        if (selected) {
            dispatch(actionCreators.select(relnId, entityId, firstLevelId, secondLevelId));
        } else if (secondLevelId) {
            dispatch(actionCreators.select(relnId, entityId, firstLevelId));
        } else {
            dispatch(actionCreators.select());
        }
    },
    showAll: (dispatch, relnId, entityId, showAll = true) => dispatch(actionCreators.showAll(relnId, entityId, showAll)),
    setSearchValue: (dispatch, value) => dispatch(actionCreators.setSearchValue(value))
});

export const reducers = concatenateReducers([{
    actions: [ actions.SET_SELECTION ],
    reducer: (state = {}, action) => updaters.attribute(state, 'selection', action.payload)
}, {
    actions: [ actions.SET_SEARCH_VALUE ],
    reducer: (state = {}, action) => updaters.attribute(state, 'searchValue', action.payload.value)
}, {
    actions: [ actions.SET_SHOWING_ALL ],
    reducer: (state = {}, action) => {
        const showingAll = selectors.attribute(state, 'showingAll', []);

        const foundShowingAll = showingAll.find((item) => item.relnId === action.payload.relnId && item.entityId === action.payload.entityId);
        if (foundShowingAll) {
            foundShowingAll.showAll = action.payload.showAll;
        } else {
            showingAll.push({
                relnId: action.payload.relnId,
                entityId: action.payload.entityId,
                showAll: action.payload.showAll
            });
        }

        return updaters.attribute(state, 'showingAll', showingAll);
    }
}]);

export const selectors = Object.freeze({
    attribute: (state, attribute, defaultValue) => getNamespaceAttribute(state, namespace, attribute, defaultValue),
    substate: (state) => getNamespaceSubstate(state, namespace)
});

const updaters = Object.freeze({
    attribute: (state, attribute, value) => setNamespaceAttribute(state, namespace, attribute, value),
    substate: (state, substate) => setNamespaceSubstate(state, namespace, substate)
});
