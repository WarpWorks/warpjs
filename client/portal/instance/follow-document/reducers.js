import extend from 'lodash/extend';
import pick from 'lodash/pick';

import actions from './actions';
// import _debug from './debug'; const debug = _debug('reducers');
import namespace from './namespace';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const initializeState = (state = {}, action) => {
    const substate = pick(action.payload, ['following', 'followUrl', 'unfollowUrl']);
    return setSubstate(state, namespace, substate);
};

const updateFollow = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    const newSubstate = extend({}, substate, {
        following: Boolean(action.payload.following)
    });
    return setSubstate(state, namespace, newSubstate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    { actions: [ actions.UPDATE_FOLLOW ], reducer: updateFollow },
]);
