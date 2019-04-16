import extend from 'lodash/extend';
import pick from 'lodash/pick';

import actions from './actions';
// import _debug from './debug'; const debug = _debug('reducers');
import namespace from './namespace';


const NAMESPACE = namespace();

const initializeState = (state = {}, action) => {
    const substate = pick(action.payload, ['following', 'followUrl', 'unfollowUrl']);
    return extend({}, state, { [NAMESPACE]: substate });
};

const updateFollow = (state = {}, action) => {
    const substate = state[NAMESPACE] || {};
    const newSubstate = extend({}, substate, {
        following: Boolean(action.payload.following)
    });
    return extend({}, state, { [NAMESPACE]: newSubstate });
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    { actions: [ actions.UPDATE_FOLLOW ], reducer: updateFollow },
]);
