import * as actionCreators from './action-creators';

export const updateFilter = async (dispatch, attribute, nextState) => {
    dispatch(actionCreators.updateFilter(attribute, nextState));
};

export const initialize = async (dispatch) => {
    dispatch(actionCreators.initialize());
};
