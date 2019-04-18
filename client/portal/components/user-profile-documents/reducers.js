import cloneDeep from 'lodash/cloneDeep';
import extend from 'lodash/extend';

import actions from './actions';
import namespace from './namespace';

const NAMESPACE = namespace();

const getSubstate = (state = {}) => cloneDeep(state[NAMESPACE] || {});
const setSubstate = (state, newSubstate) => extend({}, state, { [NAMESPACE]: newSubstate });

const error = (state = {}, action) => {
    const substate = getSubstate(state);

    substate.error = true;
    substate.errorMessage = action.payload.message;
    substate.err = action.payload.err;
    return setSubstate(state, substate);
};

const results = (state = {}, action) => {
    const substate = getSubstate(state);

    substate.error = false;
    substate.errorMessage = undefined;
    substate.err = undefined;
    substate.documents = cloneDeep(action.payload.documents);

    return setSubstate(state, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.RESULTS ], reducer: results },
    { actions: [ actions.ERROR ], reducer: error },
]);
