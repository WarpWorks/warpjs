import reduxConcatenateReducers from 'redux-concatenate-reducers';

import actions from './actions';
import guardAction from './../../../react-utils/guard-action';

const initializeState = (state = {}, action) => {
    return action.payload.state;
};

export default reduxConcatenateReducers([
    guardAction([actions.INITIAL_STATE], initializeState),
]);
