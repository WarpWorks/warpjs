import extend from 'lodash/extend';
import pick from 'lodash/pick';

import actions from './actions';
import _debug from './debug';
import namespace from './namespace';

const NAMESPACE = namespace();
const debug = _debug('reducers');

const initializeState = (state = {}, action) => {
    debug(`initializeState(): state=`, state);
    debug(`initializeState(): action=`, action);
    const substate = pick(action.payload, ['following', 'url']);

    const newState = extend({}, state, { [NAMESPACE]: substate });
    debug(`initializeState(): newState=`, newState);
    return newState;
};

const updateFollow = (state = {}, action) => {
    const substate = state[NAMESPACE] || {};

    substate.state = Boolean(action.payload.state);

    return extend({}, state, { [NAMESPACE]: substate });
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    { actions: [ actions.UPDATE_FOLLOW ], reducer: updateFollow },
]);
