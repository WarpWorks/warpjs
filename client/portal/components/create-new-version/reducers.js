import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const { baseAttributeReducer, concatenateReducers, getNamespaceSubstate, setNamespaceSubstate } = window.WarpJS.ReactUtils;

export default concatenateReducers([{
    actions: [ actions.HIDE ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'showCreate', false)
}, {
    actions: [ actions.RESET_VERSION ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);
        delete substate.nextVersion;
        return setNamespaceSubstate(state, namespace, substate);
    }
}, {
    actions: [ actions.SHOW ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'showCreate', true)
}, {
    actions: [ actions.UPDATE_VERSION ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'nextVersion', action.payload.nextVersion)
}]);
