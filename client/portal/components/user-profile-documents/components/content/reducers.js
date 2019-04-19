import extend from 'lodash/extend';

import actions from './actions';
import { KEYS } from './constants';
import namespace from './namespace';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const updateFilter = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    substate.filters = substate.filters || {};
    substate.filters[action.payload.attribute] = action.payload.nextState;
    return setSubstate(state, namespace, substate);
};

const initialize = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    if (!substate.filters) {
        substate.filters = KEYS.reduce((memo, key) => extend(memo, { [key]: true }), {});
        return setSubstate(state, namespace, substate);
    } else {
        return state;
    }
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.INITIALIZE ], reducer: initialize },
    { actions: [ actions.UPDATE_FILTER ], reducer: updateFilter },
]);
