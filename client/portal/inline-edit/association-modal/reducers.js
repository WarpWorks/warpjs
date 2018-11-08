import actions from './actions';
import concatenateReducers from './../../../react-utils/concatenate-reducers';
import reducers from './components/reducers';

const initializeState = (state = {}, action) => {
    return action.payload.state;
};

export default concatenateReducers([
    { actions: [actions.INITIAL_STATE], reducer: initializeState },
    reducers
]);
