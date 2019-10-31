import extend from 'lodash/extend';
import pick from 'lodash/pick';

import actions from './actions';
// import _debug from './debug'; const debug = _debug('reducers');
import namespace from './namespace';

const { concatenateReducers, getNamespaceSubstate, setNamespaceSubstate } = window.WarpJS.ReactUtils;

export default concatenateReducers([{
    actions: [ actions.INITIAL_STATE ],
    reducer: (state = {}, action) => setNamespaceSubstate(state, namespace, pick(action.payload, [ 'following', 'followUrl', 'unfollowUrl' ]))
}, {
    actions: [ actions.UPDATE_FOLLOW ],
    reducer: (state = {}, action) => {
        const substate = getNamespaceSubstate(state, namespace);
        const newSubstate = extend({}, substate, {
            following: Boolean(action.payload.following)
        });
        return setNamespaceSubstate(state, namespace, newSubstate);
    }
}]);
