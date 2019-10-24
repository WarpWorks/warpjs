import isUndefined from 'lodash/isUndefined';

import actions from './actions';
import { KEYS } from './constants';
import namespace from './namespace';

// import _debug from './debug'; const debug = _debug('reducers');

const { concatenateReducers, getNamespaceSubstate, setNamespaceSubstate } = window.WarpJS.ReactUtils;

const updateFilter = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);

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

    return setNamespaceSubstate(state, namespace, substate);
};

const updateSortBy = (state = {}, action) => {
    const substate = getNamespaceSubstate(state, namespace);
    if (!substate[action.payload.id]) {
        substate[action.payload.id] = {};
    }
    const substateId = substate[action.payload.id];

    substateId.sortBy = action.payload.value;
    return setNamespaceSubstate(state, namespace, substate);
};

export default concatenateReducers([
    { actions: [ actions.UPDATE_FILTER ], reducer: updateFilter },
    { actions: [ actions.UPDATE_SORT_BY ], reducer: updateSortBy }
]);
