import extend from 'lodash/extend';
import pick from 'lodash/pick';

import actions from './actions';
import namespace from './namespace';

const NAMESPACE = namespace();

const initializeState = (state = {}, action) => {
    const substate = pick(action.payload, ['myPage']);
    return extend({}, state, { [NAMESPACE]: substate });
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIAL_STATE ], reducer: initializeState },
    window.WarpJS.ReactComponents.reducers
]);
