import cloneDeep from 'lodash/cloneDeep';

import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const { baseAttributeReducer, concatenateReducers, getNamespaceSubstate, INIT_TYPE, setNamespaceSubstate } = window.WarpJS.ReactUtils;

export default concatenateReducers([{
    actions: [ INIT_TYPE ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);
        substate.error = false;
        substate.errorMessage = null;
        substate.err = null;
        substate.showDetailsFor = null;
        return setNamespaceSubstate(state, namespace, substate);
    }
}, {
    actions: [ actions.ERROR ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);
        substate.error = true;
        substate.errorMessage = action.payload.message;
        substate.err = action.payload.err;
        return setNamespaceSubstate(state, namespace, substate);
    }
}, {
    actions: [ actions.HIDE_DETAILS ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'showDetailsFor', null)
}, {
    actions: [ actions.RESET_MODAL ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'showDetailsFor', null)
}, {
    actions: [ actions.RESULTS ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);
        substate.error = false;
        substate.errorMessage = undefined;
        substate.err = undefined;
        substate.notifications = cloneDeep(action.payload.notifications);
        return setNamespaceSubstate(state, namespace, substate);
    }
}, {
    actions: [ actions.SHOW_DETAILS ],
    reducer: (state = {}, action) => baseAttributeReducer(state, namespace, 'showDetailsFor', action.payload)
}]);
