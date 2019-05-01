import cloneDeep from 'lodash/cloneDeep';
import { reducers as componentsReducers } from './components';

import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const error = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.error = true;
    substate.errorMessage = action.payload.message;
    substate.err = action.payload.err;
    return setSubstate(state, namespace, substate);
};

const results = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.error = false;
    substate.errorMessage = undefined;
    substate.err = undefined;
    substate.documents = cloneDeep(action.payload.documents);
    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.RESULTS ], reducer: results },
    { actions: [ actions.ERROR ], reducer: error },
    componentsReducers
]);
