import isUndefined from 'lodash/isUndefined';

import actions from './actions';
import { KEYS } from './constants';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const getSubstate = window.WarpJS.ReactUtils.getNamespaceSubstate;
const setSubstate = window.WarpJS.ReactUtils.setNamespaceSubstate;

const updateFilter = (state = {}, action) => {
    const substate = getSubstate(state, namespace);

    if (!substate[action.payload.id]) {
        substate[action.payload.id] = {};
    }

    const substateId = substate[action.payload.id];

    if (!substateId.filters) {
        substateId.filters = {};
    }

    substateId.filters[action.payload.attribute] = action.payload.nextState;

    KEYS.forEach((key) => {
        if (isUndefined(substateId.filters[key])) {
            substateId.filters[key] = true;
        }
    });

    return setSubstate(state, namespace, substate);
};

const updateSortBy = (state = {}, action) => {
    const substate = getSubstate(state, namespace);
    if (!substate[action.payload.id]) {
        substate[action.payload.id] = {};
    }
    const substateId = substate[action.payload.id];

    substateId.sortBy = action.payload.value;
    return setSubstate(state, namespace, substate);
};

export default window.WarpJS.ReactUtils.concatenateReducers([
    { actions: [ actions.UPDATE_FILTER ], reducer: updateFilter },
    { actions: [ actions.UPDATE_SORT_BY ], reducer: updateSortBy },
]);
