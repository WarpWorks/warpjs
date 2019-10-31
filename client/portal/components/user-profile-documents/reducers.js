import cloneDeep from 'lodash/cloneDeep';

import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const { concatenateReducers, getNamespaceSubstate, setNamespaceSubstate } = window.WarpJS.ReactUtils;

export default concatenateReducers([{
    actions: [ actions.RESULTS ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);
        substate.error = false;
        substate.errorMessage = undefined;
        substate.err = undefined;
        substate.documents = cloneDeep(action.payload.documents);
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
}]);
