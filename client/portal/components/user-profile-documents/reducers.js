import cloneDeep from 'lodash/cloneDeep';

import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const { concatenateReducers, getNamespaceSubstate, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const error = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.error = true;
    substate.errorMessage = action.payload.message;
    substate.err = action.payload.err;
    return setNamespaceSubstate(state, namespace, substate);
};

const results = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    substate.error = false;
    substate.errorMessage = undefined;
    substate.err = undefined;
    substate.documents = cloneDeep(action.payload.documents);
    return setNamespaceSubstate(state, namespace, substate);
};

export default concatenateReducers([
    { actions: [ actions.RESULTS ], reducer: results },
    { actions: [ actions.ERROR ], reducer: error }
]);
