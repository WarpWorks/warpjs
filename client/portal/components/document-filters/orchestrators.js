import * as actionCreators from './action-creators';

// import _debug from './debug'; const debug = _debug('orchestrators');

export const updateFilter = async (dispatch, id, attribute, nextState) => {
    dispatch(actionCreators.updateFilter(id, attribute, nextState));
};

export const updateSortBy = async (dispatch, id, event) => {
    dispatch(actionCreators.updateSortBy(id, event.target.value));
};
