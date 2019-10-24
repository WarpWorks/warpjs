import extend from 'lodash/extend';
import pick from 'lodash/pick';

import actions from './actions';
// import _debug from './debug'; const debug = _debug('reducers');
import namespace from './namespace';

const { concatenateReducers, getNamespaceSubstate, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const initializeState = (state = {}, action) => {
    const substate = pick(action.payload, [ 'following', 'followUrl', 'unfollowUrl' ]);
    return setNamespaceSubstate(state, namespace, substate);
};

const updateFollow = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    const newSubstate = extend({}, substate, {
        following: Boolean(action.payload.following)
    });
    return setNamespaceSubstate(state, namespace, newSubstate);
};

export default concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    { actions: [ actions.UPDATE_FOLLOW ], reducer: updateFollow }
]);
