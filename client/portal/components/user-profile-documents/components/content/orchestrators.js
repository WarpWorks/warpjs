import * as actionCreators from './action-creators';

// import _debug from './debug'; const debug = _debug('orchestrators');

export const updateFilter = async (dispatch, attribute, nextState) => {
    dispatch(actionCreators.updateFilter(attribute, nextState));
};

export const updateSortBy = async (dispatch, event) => {
    dispatch(actionCreators.updateSortBy(event.target.value));
};
