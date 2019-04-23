import * as actionCreators from './action-creators';

export const updateAggregation = async (dispatch, newId) => {
    dispatch(actionCreators.updateAggregation(newId));
}
