import actions from './actions';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const initialize = (state = {}, action) => {
    return setSubstate(state, namespace, action.payload);
};

const updateAggregation = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.aggregationSelected = action.payload.aggregationSelected;
    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initialize },
    { actions: [ actions.UPDATE_AGGREGATION ], reducer: updateAggregation }
]);
