import extend from 'lodash/extend';

import actions from './actions';
import { KEYS, SORT_KEYS } from './constants';
import namespace from './namespace';

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const init = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.filters = KEYS.reduce((memo, key) => extend(memo, { [key]: true }), {});
    substate.sortBy = SORT_KEYS.DATE;
    return setSubstate(state, namespace, substate);
};

const updateFilter = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    substate.filters = substate.filters || {};
    substate.filters[action.payload.attribute] = action.payload.nextState;
    return setSubstate(state, namespace, substate);
};

const updateSortBy = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    substate.sortBy = action.payload.value;
    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ window.WarpJS.ReactUtils.INIT_TYPE ], reducer: init },
    { actions: [ actions.UPDATE_FILTER ], reducer: updateFilter },
    { actions: [ actions.UPDATE_SORT_BY ], reducer: updateSortBy },
]);
