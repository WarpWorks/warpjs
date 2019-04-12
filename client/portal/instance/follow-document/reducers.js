// const debug = require('./debug')('reducers');

import extend from 'lodash/extend';
import pick from 'lodash/pick';

import actions from './actions';
import namespace from './namespace';

const NAMESPACE = namespace();

const initializeState = (state = {}, action) => {
    const substate = pick(action.payload, ['following', 'followUrl', 'unfollowUrl']);
    const newState = extend({}, state, { [NAMESPACE]: substate });
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
